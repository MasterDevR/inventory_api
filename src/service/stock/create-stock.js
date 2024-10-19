const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createItem = async (item, image) => {
  console.log("asdadsf");
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
        quantity_on_hand: +item.quantity,
        reference: item.reference,
        distributor: item.distributor,
        consume_date: +item.consume,
        stock_type: type.id,
        created_at: new Date(item.date),
        purchase_order: item.purchase_order,
      },
    });
    await prisma.stock_history.createMany({
      data: [
        {
          stock_no: item.stock,
          price: +item.price,
          quantity_on_hand: +item.quantity,
          distributor: item.distributor,
          created_at: new Date(item.date),
          purchase_order: item.purchase_order,
        },
      ],
    });

    return { status: 201, message: "Item Created." };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = createItem;
