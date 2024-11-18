const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStockReport = async (item, year) => {
  try {
    const stockNo = await prisma.stock.findFirst({
      where: {
        item: item,
      },
      select: {
        stock_no: true,
      },
    });

    const result = await prisma.stock_history.findMany({
      where: {
        stock_no: stockNo.stock_no,
        created_at: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      select: {
        stock_no: true,
        quantity_issued: true,
        quantity_on_hand: true,
        total_request: true,
        created_at: true,
      },
    });
    return { status: 200, result };
  } catch (error) {
    return { status: 500, message: "Something Went Wrong." };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = getStockReport;
