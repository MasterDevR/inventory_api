const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (data) => {
  try {
    const status = await prisma.transaction_status.findFirst({
      where: {
        name: "ready",
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
    return { status: 200, message: "Item is ready to pick-up" };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
