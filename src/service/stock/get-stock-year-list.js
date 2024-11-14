const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStockYearList = async () => {
  try {
    const result = await prisma.stock.findMany({
      select: {
        item: true,
        stock_no: true,
        stockHistories: {
          select: {
            created_at: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
module.exports = getStockYearList;
