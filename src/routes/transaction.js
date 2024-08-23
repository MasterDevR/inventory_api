const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
  try {
    const { data, purpose } = req.body;
    const { departmentId } = req.params;

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
    for (const item of data) {
      console.log(item.quantity);
      await prisma.transaction.create({
        data: {
          stock_no: item.stock,
          quantity: +item.quantity,
          department_id: departmentId,
          status: reqStatus.id,
          transaction_purpose: Purpose.id,
        },
      });
      await prisma.stock.update({
        where: {
          stock_no: item.stock,
        },
        data: {
          total_quantity_request: {
            increment: +item.quantity,
          },
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
      const result = await prisma.stock_history.updateMany({
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
      console.log(result, history.id, item.stock);
    }
    res.send({ status: 200, message: "Item Requested Successfuly." });
  } catch (error) {
    console.log(error);
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};
const getTransactionPurpose = async (req, res) => {
  try {
    const purpose = await prisma.transaction_purpose.findMany({
      select: { name: true },
    });
    res.send({ status: 200, data: purpose });
  } catch (error) {
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};
module.exports = { createTransaction, getTransactionPurpose };
