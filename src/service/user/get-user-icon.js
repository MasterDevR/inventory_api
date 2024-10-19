const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (department_id) => {
  try {
    return await prisma.user.findFirst({
      where: {
        department_id: department_id,
      },
      select: {
        image: true,
      },
    });
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
