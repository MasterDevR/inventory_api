const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const updateItem = async (itemData) => {
  try {
    const isExisting = await prisma.stock.findMany({
      where: {
        item: itemData.name,
        description: itemData.description,
        stock_no: itemData.stock,
      },
    });

    if (isExisting.length > 0) {
      await prisma.stock.update({
        where: {
          id: isExisting[0].id,
        },
        data: {
          price: +itemData.price,
          quantity: isExisting[0].quantity + +itemData.quantity,
          distributor: itemData.distributor,
        },
      });
      await prisma.stock_history.create({
        data: {
          stock_id: isExisting[0].id,
          price: +itemData.price,
          quantity: +itemData.quantity,
          distributor: itemData.distributor,
        },
      });
      return { status: 200, message: "Item Updated." };
    } else {
      return { status: 404, itemData };
    }
  } catch (err) {
    return { status: 500, message: `${err.message}` };
  }
};

module.exports = updateItem;
