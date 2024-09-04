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

    for (const i in items) {
      const item = items[i];
      await prisma.transaction_item.update({
        where: {
          id: item.item_id,
          transaction_id: item.transaction_id,
        },
        data: {
          approved_quantity: item.approved_quantity,
        },
      });
      const history = await prisma.stock_history.findMany({
        where: {
          stock_no: item.stock_no,
          quantity_on_hand: {
            gt: 0,
          },
        },
        take: 2,
      });
      const filteredHistory = history.reduce(
        (result, current, index, array) => {
          if (index > 0 && array[index - 1].quantity_on_hand > 0) {
            return result;
          }
          result.push(current);
          return result;
        },
        []
      );
      for (const i in filteredHistory) {
        const historyToUpdate = filteredHistory[i];
        const result = await prisma.stock_history.update({
          where: {
            id: historyToUpdate.id,
          },
          data: {
            quantity_on_hand:
              historyToUpdate.quantity_on_hand - item.approved_quantity,
            quantity_issued:
              historyToUpdate.quantity_issued + item.approved_quantity,
          },
        });
      }
      const res = await prisma.stock.update({
        where: {
          stock_no: item.stock_no,
        },
        data: {
          quantity_on_hand: --item.approved_quantity,
          quantity_issued: ++item.approved_quantity,
        },
      });
    }
    return { status: 200, message: "Transaction Approved" };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
