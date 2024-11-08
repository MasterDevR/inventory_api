const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  console.log("first");
  try {
    await prisma.admin_notification.updateMany({
      where: { viewed: false },
      data: { viewed: true },
    });

    return;
  } catch (error) {
    console.log(error);
  }
};
