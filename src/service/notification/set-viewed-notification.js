const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const [adminUpdateResult, lowStockUpdateResult] = await Promise.all([
      prisma.admin_notification.updateMany({
        where: { viewed: false },
        data: { viewed: true },
      }),
      prisma.low_stock_notification.updateMany({
        where: { viewed: false },
        data: { viewed: true },
      }),
    ]);

    return;
  } catch (error) {
    console.log(error.message);
  }
};
