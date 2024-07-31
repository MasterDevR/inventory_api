const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const retrieveItem = async () => {
  const item = await prisma.stockInformation.findMany({
    select: {
      id: true,
      item: true,
      price: 150,
      description: true,
      measurement: true,
      stockNo: true,
      reOrderPoint: true,
      quantity: true,
      image: true,
      reference: true,
      consumeDate: true,
      distributor: true,
    },
  });

  return item;
};

module.exports = retrieveItem;
