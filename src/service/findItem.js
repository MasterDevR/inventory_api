const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findItem = async (stock_no) => {
  try {
    const result = await prisma.transaction.findMany({
      where: { stock_no },
    });

    if (result === null || result.length <= 0) {
      return { status: 404, message: "Item Not Found." };
    }
    return { status: 403, message: "Item Cannot Be Delete." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = findItem;
