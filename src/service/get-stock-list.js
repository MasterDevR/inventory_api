const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const retrieveItem = async () => {
  try {
    const item = await prisma.stock.findMany();
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
