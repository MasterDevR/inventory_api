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
        Requestor_type: {
          select: {
            name: true,
          },
        },
      },
    });

    if (users === null || users.length <= 0) {
      return { status: 404, message: "Cannot Find Users." };
    }
    return { status: 200, users };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = getAllUser;
