const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const encrypPassword = require("../../utils/encryp-password");

const createUser = async (userData) => {
  try {
    const password = await encrypPassword(userData.password);
    const userRole = await prisma.role.findFirst({
      where: {
        name: userData.role,
      },
    });
    await prisma.user.create({
      data: {
        name: userData.username,
        email: userData.Email,
        department_id: userData.department_id,
        department_code: userData.department_code,
        department: userData.department,
        role: userRole.id,
        image: userData.imageSrc,
        password: password,
      },
    });
    return 200;
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = createUser;
