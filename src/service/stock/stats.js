const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const Stock = await prisma.stock.count();
    const User = await prisma.user.count();
    const Pending = await prisma.transaction.count({
      where: {
        Status: {
          name: "pending",
        },
      },
    });
    return { status: 200, Stock, User, Pending };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
