const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

    return { status: 200, message: "Transaction Rejected" };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
