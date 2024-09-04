const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTopStock = async () => {
  try {
    const item = await prisma.stock.findMany({
      orderBy: {
        stock_counter: "desc",
      },
      include: {
        stockHistories: {
          orderBy: { created_at: "desc" },
          take: 2,
        },
      },
      take: 3,
    });
    return { status: 200, data: item };
  } catch (error) {
    return { status: 500, message: "Somethign went wrong." };
  }
};

module.exports = getTopStock;
