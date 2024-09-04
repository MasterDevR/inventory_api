const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const res = await prisma.admin_notification.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
    const result = await prisma.user.findMany({
      where: {
        department_id: res.department,
      },
      select: {
        image: true,
      },
    });
    const updatedresult = res.map((item) => ({
      ...item,
      image: result?.image,
    }));
    return updatedresult;
  } catch (error) {
    console.log(error.message);
  }
};
