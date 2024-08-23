const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getStorage, ref, deleteObject } = require("firebase/storage");

const updateEditedStock = async (stock_no, data, file) => {
  try {
    let latestStockNo = stock_no;

    if (stock_no !== data.stock_no) {
      latestStockNo = data.stock_no;
      await prisma.$transaction(async (prisma) => {
        await prisma.stock.update({
          where: {
            stock_no: stock_no,
          },
          data: {
            stock_no: latestStockNo,
          },
        });
        await prisma.stock_history.updateMany({
          where: {
            stock_no: stock_no,
          },
          data: {
            stock_no: latestStockNo,
          },
        });
      });
    }

    const latestHistory = await prisma.stock_history.findFirst({
      where: {
        stock_no: latestStockNo,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (latestHistory) {
      await prisma.stock_history.update({
        where: {
          id: latestHistory.id,
        },
        data: {
          price: +data.price,
          quantity: +data.quantity,
          distributor: data.distributor,
        },
      });
    }

    const stockRecord = await prisma.stock.findUnique({
      where: {
        stock_no: latestStockNo,
      },
      select: {
        total_quantity_request: true,
      },
    });

    const totalQuantity = await prisma.stock_history.aggregate({
      where: {
        stock_no: latestStockNo,
      },
      _sum: {
        quantity: true,
      },
    });

    const latestQuantity =
      totalQuantity._sum.quantity - stockRecord.total_quantity_request;

    let itemImage = await prisma.stock.findUnique({
      where: { stock_no: latestStockNo },
      select: {
        image: true,
      },
    });

    if (file !== undefined) {
      const storage = getStorage();

      const filePath = itemImage.image
        .split("/o/")[1]
        .split("?")[0]
        .replace(/%2F/g, "/");

      const fileRef = ref(storage, filePath);
      deleteObject(fileRef);

      itemImage = await uploadImage(req.file, "file");
    }

    await prisma.stock.update({
      where: {
        stock_no: latestStockNo,
      },
      data: {
        item: data.name,
        price: +data.price,
        quantity: latestQuantity,
        description: data.description,
        measurement: data.measurement,
        re_order_point: data.order,
        reference: data.reference,
        consume_date: +data.consume,
        distributor: data.distributor,
        image: itemImage.image,
      },
    });

    return { status: 200, message: "Item Updated." };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

module.exports = updateEditedStock;
