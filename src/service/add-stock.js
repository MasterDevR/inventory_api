const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findStockByStockNo = async (stock_no, data) => {
  try {
    const stock = await prisma.stock.findUnique({
      where: {
        stock_no: stock_no,
      },
    });
    if (stock === null) {
      return { status: 404, message: "Invalid Stock Number." };
    }

    await prisma.stock.update({
      where: {
        stock_no: stock_no,
      },
      data: {
        price: +data.price,
        quantity: stock.quantity + +data.quantity,
        distributor: data.distributor,
      },
    });
    await prisma.stock_history.create({
      data: {
        stock_no: stock_no,
        price: +data.price,
        quantity: +data.quantity,
        distributor: data.distributor,
      },
    });

    // const latestItem = await prisma.stock_history.findFirst({
    //   orderBy: {
    //     created_at: "desc",
    //   },
    // });
    // console.log(latestItem);
    return { status: 200, message: "Item Updated." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = findStockByStockNo;
