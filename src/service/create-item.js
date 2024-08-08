const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createItem = async (itemData) => {
  try {
    for (item of itemData) {
      const stockType = await prisma.stock_type.findMany({
        where: {
          name: item.stockType,
        },
        select: {
          id: true,
        },
      });

      await prisma.stock.create({
        data: {
          item: item.name,
          image: item.image,
          price: +item.price,
          description: item.description,
          measurement: item.measurement,
          stock_no: item.stock,
          re_order_point: item.order,
          quantity: +item.quantity,
          reference: item.reference,
          distributor: item.distributor,
          consume_date: +item.consume,
          stock_type: stockType[0].id,
        },
      });
      await prisma.stock_history.createMany({
        data: [
          {
            stock_no: item.stock,
            price: +item.price,
            quantity: +item.quantity,
            distributor: item.distributor,
          },
        ],
      });
    }

    return { status: 201, message: "Item created successfully." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = createItem;
