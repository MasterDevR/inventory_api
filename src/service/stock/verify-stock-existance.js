const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkMatches = async (itemData) => {
  try {
    const result = await prisma.stock.findMany({
      where: {
        OR: [
          { item: itemData.name },
          { stock_no: itemData.stock },
          { description: itemData.description },
        ],
      },
    });

    let status, message;

    if (result.length > 0) {
      status = 200;
      message = "Item is already existing.";
    } else {
      status = 404;
      message = "No matches found in the stock table.";
    }

    return { status, message };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = checkMatches;
