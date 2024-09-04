const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    await prisma.admin_notification.updateMany({
      data: {
        viewed: true,
      },
    });
    return;
  } catch (error) {
    console.log(error.message);
  }
};
