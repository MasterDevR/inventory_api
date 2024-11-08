const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  const requestorType = await prisma.requestor_type.findMany();
  return requestorType;
};
