const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const updateItem = require("../service/update-item");

const createItem = async (itemData, imagePath) => {
  try {
    const result = await updateItem(itemData);

    if (result.status === 200) {
      console.log("Item defined");
      return result;
    } else if (result.status === 404) {
      // Check if an item with the same stockNo already exists
      const existingItem = await prisma.stock.findUnique({
        where: {
          stock_no: itemData.stock.toLowerCase(),
        },
      });

      if (existingItem) {
        return {
          status: 409,
          message:
            "Stock Number and reOrderPoint must be unique to the other item.",
        };
      }
      const newStock = await prisma.stock.create({
        data: {
          item: itemData.item.toLowerCase(),
          image: imagePath,
          price: +itemData.price,
          description: itemData.description.toLowerCase(),
          measurement: itemData.measurement.toLowerCase(),
          stock_no: itemData.stock.toLowerCase(),
          re_order_point: itemData.order.toLowerCase(),
          quantity: +itemData.quantity,
          reference: itemData.reference.toLowerCase(),
          distributor: itemData.distributor.toLowerCase(),
          consume_date: +itemData.consume,
          stock_type: itemData.stockType,
        },
      });
      await prisma.stock_history.createMany({
        data: [
          {
            stock_id: newStock.id,
            price: newStock.price,
            quantity: newStock.quantity,
            distributor: newStock.distributor,
          },
        ],
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
