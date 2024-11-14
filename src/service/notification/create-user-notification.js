const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (data, department_id) => {
  try {
    const status = await prisma.transaction_status.findUnique({
      where: {
        name: data.status || "",
      },
      select: {
        id: true,
      },
    });

    if (!status) {
      return { status: 404, message: "Transaction status not found." };
    }

    await prisma.department_notification.create({
      data: {
        department_id: department_id || "",
        status: status.id,
        transaction_id: data.transaction_id || "",
      },
    });
    return;
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
