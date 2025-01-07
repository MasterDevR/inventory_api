// completed transaction
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generateEmail = require("../notification/generate-email-notification");
const generateUserNotification = require("../notification/create-user-notification");
module.exports = setTransactionCompleted = async (data) => {
  try {
    const status = await prisma.transaction_status.findFirst({
      where: { name: "completed" },
      select: { id: true },
    });
    const transaction = await prisma.transaction.update({
      where: { id: data.transaction_id },
      data: { status: status.id },
    });
    if (transaction) {
      const response = await prisma.transaction.findMany({
        where: {
          id: data.transaction_id,
        },
        select: {
          user: {
            select: {
              email: true,
              department_id: true,
            },
          },
        },
      });

      await generateEmail(response[0].user.email, "completed");
      await generateUserNotification(data, response[0].user.department_id);
      return { status: 200, message: "Transaction completed" };
    } else {
      return { status: 404, message: "Transaction not found" };
    }
  } catch (error) {
    return { status: 500, message: "Something went wrong" };
  }
};
