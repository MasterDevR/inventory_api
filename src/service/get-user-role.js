const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findRole = async () => {
  try {
    const result = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    if (result === null) {
      return { status: 404, message: "Role Not Found.", item: null };
    }
    return { status: 200, message: "Found", result: result };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = findRole;
