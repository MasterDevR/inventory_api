const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNewItem = async (newItem) => {
  try {
    const item = await prisma.stockInformation.create({
      data: {
        itemName: newItem.item.toLowerCase(),
        description: newItem.description.toLowerCase(),
        measurement: newItem.measurement.toLowerCase(),
        stockNo: newItem.stock.toLowerCase(),
        quantity: +newItem.quantity,
        reOrderPoint: newItem.order.toLowerCase(),
        reference: newItem.reference.toLowerCase(),
        consumeDate: +newItem.consume,
        image: newItem.downloadURL.toLowerCase(),
        price: +newItem.price,
        distributor: newItem.distributor.toLowerCase(),
        createdBy: newItem.id.toLowerCase(),
      },
    });
    return { status: 200, item };
  } catch (error) {
    return { status: 500, message: `${error.message}` };
  }
};

module.exports = createNewItem;
