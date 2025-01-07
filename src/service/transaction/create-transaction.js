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
    const departmentCode = await prisma.user.findFirst({
      where: {
        department_id: departmentId,
      },
      select: {
        department_code: true,
      },
    });
    const transactionDate = new Date();

    // Extract components of the transaction date
    const year = transactionDate.getFullYear();
    const month = String(transactionDate.getMonth() + 1).padStart(2, "0"); // Add 1 and pad with leading zero
    const date = String(transactionDate.getDate()).padStart(2, "0"); // Pad with leading zero
    const seconds = String(transactionDate.getSeconds()).padStart(2, "0");

    // Combine to create a unique transaction ID
    const formattedTransactionId = `${departmentCode.department_code}${year}${month}${date}${seconds}`;

    const transaction = await prisma.transaction.create({
      data: {
        id: formattedTransactionId,
        department_id: departmentId,
        status: reqStatus.id,
        transaction_purpose: Purpose.id,
        created_at: dateNow,
      },
    });
    const dataArray = Array.isArray(data) ? data : [data];
    const promises = dataArray.map(async (item) => {
      await prisma.transaction_item.create({
        data: {
          transaction_id: transaction.id,
          stock_no: item.stock,
          price: +item.price,
          quantity: +item.quantity,
          created_at: dateNow,
        },
      });
    });

    await Promise.all(promises);

    return {
      status: 200,
      message: "Item Requested Successfuly.",
      id: transaction.id,
    };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
