const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (stock_no) => {
  try {
    const result = await prisma.stock_history.findMany({
      where: {
        stock_no: stock_no,
      },
      include: {
        stock: {
          include: {
            stocktype: {},
          },
        },
      },
    });

    return { status: 200, result };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
