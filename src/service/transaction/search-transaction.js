const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (searchData) => {
  try {
    const result = await prisma.transaction.findMany({
      orderBy: {
        created_at: "desc",
      },
      where: {
        OR: [
          { department_id: { contains: searchData } },
          {
            user: {
              OR: [
                { department: { contains: searchData } },
                { department_code: { contains: searchData } },
              ],
            },
          },
        ],
      },
      select: {
        ris: true,
        id: true,
        created_at: true,
        department_id: true,
        user: {
          select: {
            department_code: true,
            department: true,
          },
        },
        Status: {
          select: {
            name: true,
          },
        },
        TransactionType: {
          select: {
            name: true,
          },
        },
        transaction_item: {
          select: {
            id: true,
            transaction_id: true,
            stock_no: true,
            quantity: true,
            approved_quantity: true,

            stock: {
              select: {
                item: true,
                price: true,
                distributor: true,
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
