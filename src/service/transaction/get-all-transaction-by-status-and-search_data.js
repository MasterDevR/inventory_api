const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (status, search_data) => {
  try {
    const whereCondition = {
      AND: [
        status !== "all" ? { Status: { name: status } } : {},
        {
          OR: [
            { department_id: { contains: search_data } },
            {
              user: {
                OR: [
                  { department: { contains: search_data } },
                  { department_code: { contains: search_data } },
                ],
              },
            },
          ],
        },
      ],
    };

    const result = await prisma.transaction.findMany({
      where: whereCondition,
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
              },
            },
          },
        },
      },
    });

    return result;
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
