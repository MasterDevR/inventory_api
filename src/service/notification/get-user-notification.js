const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (departmentId) => {
  try {
    const result = await prisma.department_notification.findMany({
      orderBy: {
        updated_at: "desc",
      },
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
    console.log(error.message);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
