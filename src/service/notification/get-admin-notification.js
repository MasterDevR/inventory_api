const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  const result = await prisma.admin_notification.findMany({
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
