const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (departmentId) => {
  try {
    const result = await prisma.department_notification.findMany({
      where: {
        department_id: departmentId,
      },
      include: {
        Status: {
          select: {
            name: true,
          },
        },
      },
    });
    return { status: 200, result };
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
