const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findRole = async () => {
  try {
    const result = await prisma.role.findMany({
      orderBy: {
        name: "desc",
      },
      select: {
        id: true,
        name: true,
      },
      take: 2,
    });
    return { status: 200, result: result };
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = findRole;
