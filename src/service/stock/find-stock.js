const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findItem = async (stock_no) => {
  try {
    const result = await prisma.transaction_item.findMany({
      where: { stock_no },
    });

    if (result === null || result.length <= 0) {
      return { status: 404, message: "Item Not Found." };
    }

    return {
      status: 403,
      message:
        "Item cannot be deleted. It has associated request or distribution history.",
    };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = findItem;
