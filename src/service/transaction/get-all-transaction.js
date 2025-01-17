const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async () => {
  try {
    const result = await prisma.transaction.findMany({
      orderBy: {
        created_at: "desc",
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
            price: true,
            stock: {
              select: {
                item: true,
                measurement: true,
                distributor: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (error) {
    console.log(error.message);

    return { status: 500, message: "Something Went Wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
