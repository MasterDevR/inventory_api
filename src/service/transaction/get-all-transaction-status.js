const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    let result = await prisma.transaction_status.findMany();

    result = result.map((item) => {
      return { ...item, name: "All" };
    });
    return result;
  } catch (err) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
