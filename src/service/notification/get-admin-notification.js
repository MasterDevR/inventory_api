const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (get) => {
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
};
