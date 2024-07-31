const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const formatDate = require("../service/create-date");
const updateItem = require("../service/update-item");

const createItem = async (itemData, imagePath) => {
  try {
    const currentDate = formatDate(new Date());
    const result = await updateItem(itemData);

    if (result.status === 200) {
      console.log("Item defined");
      return result;
    } else if (result.status === 404) {
      // Check if an item with the same stockNo already exists
      const existingItem = await prisma.stockInformation.findUnique({
        where: {
          stockNo: itemData.stock.toLowerCase(),
        },
      });

      if (existingItem) {
        return {
          status: 409,
          message:
            "Stock Number and reOrderPoint must be unique to the other item.",
        };
      }

      await prisma.stockInformation.create({
        data: {
          item: itemData.item.toLowerCase(),
          image: imagePath,
          price: +itemData.price,
          description: itemData.description.toLowerCase(),
          measurement: itemData.measurement.toLowerCase(),
          stockNo: itemData.stock.toLowerCase(),
          reOrderPoint: itemData.order.toLowerCase(),
          quantity: +itemData.quantity,
          reference: itemData.reference.toLowerCase(),
          distributor: itemData.distributor.toLowerCase(),
          consumeDate: +itemData.consume,
          stockCounter: 1, // Initialize stockCounter if creating a new item
          priceList: [itemData.price],
          distributorList: [itemData.distributor],
          qtyList: [itemData.quantity],
          dateList: [currentDate],
        },
      });

      return { status: 201, message: "Item created successfully." };
    } else {
      return { status: result.status, message: result.message };
    }
  } catch (error) {
    console.error("Error creating or updating item:", error.message);
    return { status: 500, message: error.message };
  }
};

module.exports = createItem;
