const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getEditStock = async (stock_no) => {
  try {
    const history = await prisma.stock_history.findFirst({
      where: {
        stock_no: stock_no,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        quantity_on_hand: true,
      },
    });
    const stock = await prisma.stock.findUnique({
      where: {
        stock_no: stock_no,
      },
      select: {
        item: true,
        price: true,
        description: true,
        measurement: true,
        stock_no: true,
        re_order_point: true,
        distributor: true,
        consume_date: true,
        reference: true,
        image: true,
      },
    });
    const itemData = [{ ...stock, quantity_on_hand: history.quantity_on_hand }];
    if (stock.length <= 0) {
      return { status: 404, message: "Cannot find Item." };
    }
    return { status: 200, data: itemData };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = getEditStock;
