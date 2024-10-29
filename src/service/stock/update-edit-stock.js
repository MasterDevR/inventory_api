const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uploadImage = require("../../utils/upload-image");

const { getStorage, ref, deleteObject } = require("firebase/storage");

const updateEditedStock = async (stock_no, data, file) => {
  try {
    let latestStockNo = stock_no;

    // Update stock number if it has changed
    if (stock_no !== data.stock_no) {
      latestStockNo = data.stock_no;
      await prisma.$transaction(async (prisma) => {
        await prisma.stock.update({
          where: { stock_no: stock_no },
          data: { stock_no: latestStockNo },
        });
        await prisma.stock_history.updateMany({
          where: { stock_no: stock_no },
          data: { stock_no: latestStockNo },
        });
      });
    }

    // Fetch the latest stock history
    const latestHistory = await prisma.stock_history.findFirst({
      where: { stock_no: latestStockNo },
      orderBy: { created_at: "desc" },
    });

    // Update the latest stock history
    await prisma.stock_history.update({
      where: { id: latestHistory.id },
      data: {
        price: +data.price,
        quantity_on_hand: +data.quantity,
        distributor: data.distributor,
      },
    });

    // Fetch stock record for quantity calculation
    const stockRecord = await prisma.stock.findUnique({
      where: { stock_no: latestStockNo },
      select: { quantity_issued: true },
    });

    // Calculate the total quantity
    const totalQuantity = await prisma.stock_history.aggregate({
      where: { stock_no: latestStockNo },
      _sum: { quantity_on_hand: true },
    });
    const latestQuantity =
      totalQuantity._sum.quantity_on_hand - stockRecord.quantity_issued;

    // Fetch the current item image
    let itemImage = await prisma.stock.findUnique({
      where: { stock_no: latestStockNo },
      select: { image: true },
    });
    itemImage = itemImage.image;
    // Handle file upload and deletion
    if (file !== undefined) {
      const storage = getStorage();
      const filePath = itemImage
        .split("/o/")[1]
        .split("?")[0]
        .replace(/%2F/g, "/");

      const fileRef = ref(storage, filePath);

      // Try to delete the existing image, but continue even if it fails
      try {
        await deleteObject(fileRef);
      } catch (deleteError) {
        console.log("Error deleting image from Firebase:", deleteError.message);
      }

      itemImage = await uploadImage(file, "file");
    }

    await prisma.stock.update({
      where: { stock_no: latestStockNo },
      data: {
        item: data.name,
        price: +data.price,
        quantity_on_hand: latestQuantity,
        description: data.description,
        measurement: data.measurement,
        re_order_point: data.order,
        reference: data.reference,
        consume_date: +data.consume,
        distributor: data.distributor,
        image: itemImage, // Update the image
      },
    });

    return { status: 200, message: "Item Updated." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = updateEditedStock;
