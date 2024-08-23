const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTopStock = async () => {
  const item = await prisma.stock.findMany({
    orderBy: {
      total_quantity_request: "desc",
    },
    select: {
      item: true,
      price: true,
      description: true,
      quantity: true,
      re_order_point: true,
      quantity: true,
      stock_counter: true,
      image: true,
      total_quantity_request: true,
    },
    take: 3,
  });
  return { status: 200, data: item };
};

module.exports = getTopStock;
