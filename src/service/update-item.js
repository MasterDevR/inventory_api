const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const formatDate = require("../service/create-date");

const updateItem = async (itemData) => {
  const currentDate = formatDate(new Date());
  try {
    const isExisting = await prisma.stockInformation.findMany({
      where: {
        item: itemData.item,
        description: itemData.description,
      },
    });

    console.log(isExisting);
    if (isExisting.length > 0) {
      const existingItem = isExisting[0];
      const latestPrice = existingItem.price;

      // Prepare the update data
      const updateData = {
        quantity: existingItem.quantity + +itemData.quantity,
        distributorList: [
          ...existingItem.distributorList,
          itemData.distributor.toLowerCase(),
        ],
        qtyList: [...existingItem.qtyList, itemData.quantity],
        dateList: [...existingItem.dateList, currentDate],
      };

      // Only add the price if it has changed
      if (itemData.price !== latestPrice) {
        updateData.priceList = [...existingItem.priceList, itemData.price];
      }

      await prisma.stockInformation.update({
        where: {
          id: existingItem.id, // Assuming `id` is the unique identifier
        },
        data: updateData,
      });
      return { status: 200, message: "Item Updated." };
    } else {
      return { status: 404, message: "Item Cannot Be Found." };
    }
  } catch (err) {
    console.log("status", err.message);
    return { status: 500, message: `${err.message}` };
  }
};

module.exports = updateItem;
