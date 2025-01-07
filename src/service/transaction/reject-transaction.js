const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateEmail = require("../notification/generate-email-notification");
const generateUserNotification = require("../notification/create-user-notification");

module.exports = async (data) => {
  try {
    const status = await prisma.transaction_status.findFirst({
      where: {
        name: "rejected",
      },
      select: {
        id: true,
      },
    });
    await prisma.transaction.update({
      where: {
        id: data.transaction_id,
      },
      data: {
        status: status.id,
      },
    });

    const response = await prisma.transaction.findMany({
      where: {
        id: data.transaction_id,
      },
      select: {
        user: {
          select: {
            department_id: true,
            email: true,
          },
        },
      },
    });

    await generateEmail(response[0].user.email, "rejected");
    await generateUserNotification(data, response[0].user.department_id);

    return { status: 200, message: "Transaction Rejected" };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
