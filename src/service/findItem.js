const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findItem = async (id) => {
  try {
    const result = await prisma.stock.findUnique({
      where: { id },
    });
    if (result === null || users.length <= 0) {
      return { status: 404, message: "Item Not Found.", item: null };
    }
    return { status: 200, message: "Found", item: result };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = findItem;
