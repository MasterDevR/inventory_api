const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (search_item, currentPage, itemsPerPage) => {
  try {
    const item = await prisma.stock.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        OR: [
          { item: { contains: search_item } },
          { measurement: { contains: search_item } },
          { distributor: { contains: search_item } },
          { stocktype: { name: { contains: search_item } } },
        ],
      },
      include: {
        stocktype: {},
      },
    });

    return item;
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
