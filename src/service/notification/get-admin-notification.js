const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//  wa
module.exports = async (get) => {
  try {
    const result = await prisma.admin_notification.findMany({
      take: get,
      orderBy: {
        created_at: "desc",
      },
      include: {
        Transaction: {
          select: {
            user: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching admin notifications:", error.message);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};
