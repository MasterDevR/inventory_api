const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    await prisma.department_notification.updateMany({
      where: { viewed: false },
      data: { viewed: true },
    });
    return { status: 200, message: "Notification updated successfully." };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
