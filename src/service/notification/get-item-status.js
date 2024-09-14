const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const result = await prisma.stock.findMany({
      where: {},
    });

    return result;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to fetch transactions.");
  }
};
