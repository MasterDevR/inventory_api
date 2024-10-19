const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const count = await prisma.stock.count();

    return count;
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong." };
  }
};
