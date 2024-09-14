const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (search_item) => {
  try {
    const item = await prisma.stock.findMany({
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
    if (item.length <= 0) {
      return { status: 404, message: "No Data Found" };
    }
    return { status: 200, item };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong." };
  }
};
