const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    console.log("set viewed notification");
    await prisma.admin_notification.updateMany({
      where: { viewed: false },
      data: { viewed: true },
    });

    return;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};
