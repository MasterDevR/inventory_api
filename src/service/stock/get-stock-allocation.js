const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (id) => {
  try {
    const result = await prisma.stock_history.findMany({
      where: {
        id: id,
      },
      include: {
        stock: { select: { item: true } },
        transaction_item: {
          include: {
            Transaction: {
              select: {
                user: {
                  select: {
                    department_code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { status: 200, result };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something Went Wrong." };
  }
};
