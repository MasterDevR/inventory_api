const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (currentPage, itemsPerPage) => {
  try {
    const item = await prisma.stock.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: {
        description: "asc",
      },
      include: {
        stocktype: {},
      },
    });

    return item;
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};
