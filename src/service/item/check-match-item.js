const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkMatches = async (itemData) => {
  try {
    const stocks = await prisma.stock.findMany();
    let status, message;
    const results = itemData.map((item) => {
      const matches = stocks.filter(
        (stock) =>
          stock.item === item.name ||
          stock.description === item.description ||
          stock.stock_no === item.stock_no
      );

      if (matches.length > 0) {
        status = 403;
        message = "Some Of Item Is Already Existing.";
      } else {
        status = 202;
        message = "Item No Item Found";
      }
    });

    return { status, message };
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = checkMatches;
