const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllUser = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        Role: {
          name: "user",
        },
      },
      select: {
        name: true,
        image: true,
        department_id: true,
        department_code: true,
        department: true,
        email: true,
      },
    });

    if (users === null || users.length <= 0) {
      return { status: 404, message: "Cannot Find Users." };
    }
    return { status: 200, users };
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = getAllUser;
