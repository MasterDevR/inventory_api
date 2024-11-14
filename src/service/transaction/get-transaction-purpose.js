const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const purpose = await prisma.transaction_purpose.findMany({
      select: { name: true },
    });
    return { status: 200, data: purpose };
  } catch (error) {
    console.log(error.message);
    return { status: 500, data: "Something Went Wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
