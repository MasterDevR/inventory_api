const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const retrieveItem = async (searchItem) => {
  try {
    let item;
    if (searchItem !== "undefined") {
      item = await prisma.stock.findMany({
        where: {
          OR: [
            { item: { contains: searchItem } },
            { measurement: { contains: searchItem } },
            { description: { contains: searchItem } },
            {
              stocktype: {
                name: { contains: searchItem },
              },
            },
          ],
        },
        include: {
          stocktype: true,
        },
      });
    } else {
      item = await prisma.stock.findMany({
        include: {
          stocktype: {},
        },
      });
    }
    if (item.length <= 0) {
      return { status: 404, message: "No Data Found" };
    }
    return { status: 200, item };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = retrieveItem;
