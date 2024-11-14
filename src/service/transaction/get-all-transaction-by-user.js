const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (department_id, id) => {
  try {
    let result;
    if (id !== "undefined") {
      result = await prisma.transaction.findFirst({
        where: {
          id: id,
        },
        include: {
          TransactionType: {
            select: {
              name: true,
            },
          },
          Status: {
            select: { name: true },
          },
          transaction_item: {
            include: {
              stock: {
                select: {
                  description: true,
                },
              },
            },
          },
        },
      });
    } else {
      result = await prisma.transaction.findMany({
        where: {
          department_id: department_id,
        },
        include: {
          TransactionType: {
            select: {
              name: true,
            },
          },
          Status: {
            select: { name: true },
          },
        },
      });
    }
    const wrappedResult = result ? [result] : [];

    return { status: 200, result: wrappedResult };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
