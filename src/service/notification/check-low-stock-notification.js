const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkLowStock(limit) {
  try {
    const lowStockItems = await prisma.stock.findMany({
      where: {
        quantity_on_hand: {
          lte: 20,
        },
      },
      select: {
        stock_no: true,
        item: true,
        quantity_on_hand: true,
        description: true,
        image: true,
      },
      take: limit,
    });

    return lowStockItems.map((item) => ({
      stock_no: item.stock_no,
      stock: {
        item: item.item,
        quantity_on_hand: item.quantity_on_hand,
        description: item.description,
        image: item.image,
      },
    }));
  } catch (err) {
    console.error("Error checking low stock:", err.message);
    return [];
  }
}

module.exports = checkLowStock;
