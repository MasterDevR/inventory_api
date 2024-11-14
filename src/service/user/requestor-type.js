const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const requestorType = await prisma.requestor_type.findMany();
    return requestorType;
  } catch (error) {
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
