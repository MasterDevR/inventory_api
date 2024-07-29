const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createNewItem = async (newItem) => {
  try {
    const item = await prisma.stockInformation.findFirst({
      where: {
        itemName: newItem.item,
      },
    });
    return { status: 200, isExist: item };
  } catch (error) {
    return { status: 500, message: `${error.message}` };
  }
};

module.exports = createNewItem;
