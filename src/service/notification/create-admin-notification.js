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
    const admin = await prisma.admin_notification.create({
      data: {
        no_item: size,
        department: user.department,
        transaction_purpose: purpose,
        transaction_id: id,
      },
    });
    console.table(admin);
    return;
  } catch (error) {
    console.log(error.message);
  }
};
