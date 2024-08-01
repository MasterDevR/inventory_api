const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStockType = async () => {
  try {
    const stockType = await prisma.stock_type.findMany();

    if (stockType.length <= 0) {
      return { status: 404, message: "Item Not Found" };
    } else {
      return { status: 200, date: stockType };
    }
  } catch (error) {
    console.log(err.messsage);
    console.log("Caught Error getStockType : ", error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = getStockType;
