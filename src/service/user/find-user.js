const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findUser = async (userData) => {
  try {
    const result = await prisma.user.findMany({
      where: {
        department_id: userData.department_id,
        department_code: userData.department_code,
        department: userData.department,
        role: userData.role,
      },
    });
    if (result === null || users.length <= 0) {
      return { status: 404, message: "User Is Not Existing" };
    }
    return { status: 200, message: "User Is  Existing" };
  } catch (error) {
    console.error("Error creating users:", error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = findUser;
