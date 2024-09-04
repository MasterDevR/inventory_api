const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (data, purpose, departmentId) => {
  try {
    const dateNow = new Date();
    const reqStatus = await prisma.transaction_status.findFirst({
      where: {
        name: "pending",
      },
      select: {
        id: true,
      },
    });
    const Purpose = await prisma.transaction_purpose.findFirst({
      where: {
        name: purpose,
      },
      select: {
        id: true,
      },
    });

    const transaction = await prisma.transaction.create({
      data: {
        department_id: departmentId,
        status: reqStatus.id,
        transaction_purpose: Purpose.id,
        created_at: dateNow,
      },
    });
    for (const item of data) {
      await prisma.transaction_item.create({
        data: {
          transaction_id: transaction.id,
          stock_no: item.stock,
          quantity: +item.quantity,
          created_at: dateNow,
        },
      });

      const history = await prisma.stock_history.findFirst({
        where: {
          stock_no: item.stock,
        },
        orderBy: {
          created_at: "desc",
        },
      });
      await prisma.stock_history.updateMany({
        where: {
          id: history.id,
          stock_no: item.stock,
        },
        data: {
          total_request: {
            increment: +item.quantity,
          },
        },
      });
    }
    return {
      status: 200,
      message: "Item Requested Successfuly.",
      id: transaction.id,
    };
  } catch (error) {
    console.error(error.message);
    return { status: 500, message: "Something Went Wrong." };
  }
};
