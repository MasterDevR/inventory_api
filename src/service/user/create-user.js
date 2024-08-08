const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../../utils/encryp-password");

const createUser = async (userData) => {
  try {
    const password = await encrypPassword(userData.password);
    await prisma.user.createMany({
      data: {
        name: userData.username,
        email: userData.email,
        department_id: userData.department_id,
        department_code: userData.department_code,
        department: userData.department,
        role: userData.role,
        image: userData.image,
        password: password,
      },
    });
    return 200;
  } catch (error) {
    console.error("Error creating users:", error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = createUser;
