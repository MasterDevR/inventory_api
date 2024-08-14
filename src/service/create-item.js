const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createItem = async (item, image) => {
  try {
    if (item === undefined || image === null) {
      return { status: 404, message: "Data not found." };
    }
    const type = await prisma.stock_type.findFirst({
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
        image: image,
        price: +item.price,
        description: item.description,
        measurement: item.measurement,
        stock_no: item.stock,
        re_order_point: item.order,
        quantity: +item.quantity,
        reference: item.reference,
        distributor: item.distributor,
        consume_date: +item.consume,
        stock_type: type.id,
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

    return { status: 201, message: "Item Created." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = createItem;
