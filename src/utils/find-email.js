const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (departmentId) => {
  try {
    const department = await prisma.user.findUnique({
      where: { department_id: departmentId },
      select: { email: true },
    });
    if (!department) {
      return { status: 404, message: "Department not found" };
    }
    if (department.email === null) {
      return {
        status: 404,
        message:
          "Email is required before ordering or requesting an items. Please go to your profile and update your email.",
      };
    }
    return { status: 200, email: department.email };
  } catch (error) {
    console.error("Error finding email:", error);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
