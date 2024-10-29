const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  let result = await prisma.transaction_status.findMany();

  result = result.map((item) => {
    return { ...item, name: "All" };
  });
  return result;
};
