const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const refreshToken = async (token, role, id) => {
  try {
    const updateData = await prisma[
      role === "DEPARTMENT" ? "departmentInformation" : "adminInformation"
    ].update({
      where: {
        id: id,
      },
      data: {
        refreshToken: token,
      },
    });
    return { success: true, updateData };
  } catch (err) {
    console.log(err);
    return { success: false, error: err.message };
  }
};

module.exports = refreshToken;
