const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateEmail = require("../notification/generate-email-notification");

module.exports = async (data) => {
  try {
    const isItemSufficient = await checkItemSufficiency(data);
    if (isItemSufficient.status === 407 || isItemSufficient.status === 500) {
      return {
        status: isItemSufficient.status,
        message: isItemSufficient.message,
      };
    }

    const currentYear = new Date().getFullYear();

    // get the latest count of RIS
    const counter = await prisma.requisition_issue_slip_counter.upsert({
      where: { year: currentYear },
      update: { current_ris: { increment: 1 } },
      create: { year: currentYear, current_ris: 1 },
      select: { current_ris: true },
    });

    const ris = counter.current_ris;
    const status = await prisma.transaction_status.findFirst({
      where: {
        name: "approved",
      },
      select: {
        id: true,
      },
    });

    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    const risNumber = `${currentMonth}-${ris.toString().padStart(2, "0")}`;

    let totalPrice = 0;

    const promises = isItemSufficient.items.map(async (item, index) => {
      const price = parseFloat(data[`price_${index}`]);
      totalPrice += price * item.approved_quantity;

      const history = await prisma.stock_history.findMany({
        where: {
          stock_no: item.stock_no,
          quantity_on_hand: {
            gt: 0,
          },
        },
        select: {
          id: true,
          quantity_on_hand: true,
          quantity_issued: true,
          created_at: true,
        },
        orderBy: {
          created_at: "asc",
        },
      });

      let historyToUpdate = history.find(
        (stock) => stock.quantity_on_hand >= item.approved_quantity
      );

      const stockHistoryUpdate = prisma.stock_history.update({
        where: {
          id: historyToUpdate.id,
        },
        data: {
          quantity_on_hand:
            historyToUpdate.quantity_on_hand - item.approved_quantity,
          quantity_issued:
            historyToUpdate.quantity_issued + item.approved_quantity,
          total_request: item.quantity,
        },
      });

      const transactionItemUpdate = prisma.transaction_item.update({
        where: {
          id: item.item_id,
          transaction_id: item.transaction_id,
        },
        data: {
          history_id: historyToUpdate.id,
          approved_quantity: item.approved_quantity,
        },
      });

      const stockUpdate = prisma.stock.update({
        where: {
          stock_no: item.stock_no,
        },
        data: {
          quantity_on_hand: { decrement: item.approved_quantity },
          quantity_issued: { increment: item.approved_quantity },
          stock_counter: { increment: 1 },
        },
      });

      return Promise.all([
        stockHistoryUpdate,
        transactionItemUpdate,
        stockUpdate,
      ]);
    });

    await Promise.all(promises);

    await prisma.transaction.update({
      where: {
        id: data.transaction_id,
      },
      data: {
        status: status.id,
        total_price_per_transaction: +totalPrice,

        ris: risNumber,
      },
    });

    const email = await prisma.user.findFirst({
      where: {
        department_id: data.department_id,
      },
      select: {
        email: true,
      },
    });

    await generateEmail(email.email, "approved");

    await prisma.department_notification.create({
      data: {
        department_id: data.department_id,
        status: status.id,
        transaction_id: data.transaction_id,
      },
    });

    return { status: 200, message: "Transaction Approved" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};

const checkItemSufficiency = async (data) => {
  try {
    const items = [];
    let i = 0;
    while (data[`item_id_${i}`]) {
      items.push({
        stock_no: data[`stock_no_${i}`],
        transaction_id: data["transaction_id"],
        item_id: data[`item_id_${i}`],
        quantity: parseInt(data[`quantity_${i}`], 10),
        approved_quantity: parseInt(data[`approved_quantity_${i}`], 10),
      });
      i++;
    }
    // Check stock levels before approving
    const stockInfo = [];
    const insufficientItems = [];

    const stockCheckPromises = items.map(async (item) => {
      const history = await prisma.stock_history.findMany({
        where: {
          stock_no: item.stock_no,
          quantity_on_hand: { gt: 0 },
        },
        select: {
          id: true,
          quantity_on_hand: true,
          quantity_issued: true,
          created_at: true,
          stock: {
            select: {
              description: true,
              stock_no: true,
            },
          },
        },
        orderBy: { created_at: "asc" },
      });

      let availableQuantity = history.reduce(
        (sum, stock) => sum + stock.quantity_on_hand,
        0
      );

      let sufficientStock = availableQuantity >= item.approved_quantity;
      stockInfo.push({
        stock_no: item.stock_no,
        availableQuantity,
        requestedQuantity: item.approved_quantity,
        sufficient: sufficientStock,
      });

      if (!sufficientStock) {
        insufficientItems.push(item.stock_no);
      }
    });

    await Promise.all(stockCheckPromises);

    if (insufficientItems.length > 0) {
      const availableStockDetails = stockInfo
        .map(
          (stock) =>
            `${stock.stock_no}:${stock.availableQuantity}:${stock.requestedQuantity}`
        )
        .join(",");
      return {
        status: 407,
        message: availableStockDetails,
      };
    }
    return {
      status: 200,
      message: "Item is Enough.",
      items,
    };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
