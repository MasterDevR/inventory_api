const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const changePassword = async (id, password, role) => {
  console.log(role);
  try {
    const updatePassword = await prisma[
      role === "DEPARTMENT" ? "departmentInformation" : "adminInformation"
    ].update({
      where: {
        id: id,
      },
      data: {
        password: password,
      },
    });
    return updatePassword;
  } catch (err) {
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = changePassword;
