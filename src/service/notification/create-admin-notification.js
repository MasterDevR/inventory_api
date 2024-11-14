const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (size, purpose, departmentId, id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        department_id: departmentId,
      },
      select: {
        department: true,
      },
    });
    await prisma.admin_notification.create({
      data: {
        no_item: size,
        department: user.department,
        transaction_purpose: purpose,
        transaction_id: id,
      },
    });
    return;
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
