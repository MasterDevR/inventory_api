const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (data) => {
  try {
    const status = await prisma.transaction_status.findFirst({
      where: {
        name: "approved",
      },
      select: {
        id: true,
      },
    });
    await prisma.transaction.update({
      where: {
        id: data.transaction_id,
      },
      data: {
        status: status.id,
      },
    });

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

    const promises = items.map(async (item) => {
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
        },
        take: 2,
      });

      let historyToUpdate;
      if (history[0].quantity_on_hand > item.approved_quantity) {
        historyToUpdate = history[0];
      } else {
        historyToUpdate = history[1];
      }

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
        },
      });

      return Promise.all([
        stockHistoryUpdate,
        transactionItemUpdate,
        stockUpdate,
      ]);
    });

    await Promise.all(promises);

    return { status: 200, message: "Transaction Approved" };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something went wrong." };
  }
};
