const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const topStocks = await prisma.stock.findMany({
      orderBy: {
        stock_counter: "desc",
      },
      take: 5,
      select: {
        description: true,
        image: true,
        stock_no: true,
        quantity_on_hand: true,
      },
    });

    return { status: 200, topStocks };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
