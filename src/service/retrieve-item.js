const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const retrieveItem = async () => {
  try {
    const item = await prisma.stock.findMany({
      select: {
        id: true,
        item: true,
        price: 150,
        description: true,
        measurement: true,
        stock_no: true,
        re_order_point: true,
        quantity: true,
        image: true,
        reference: true,
        consume_date: true,
        distributor: true,
      },
    });

    if (item.length <= 0) {
      return { status: 404, message: "No Data Found" };
    }
    return { status: 200, item };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = retrieveItem;
