const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const deleteItem = async (stock_no, id) => {
  try {
    await prisma.stock.delete({
      where: { stock_no },
    });

    await prisma.stock_history.deleteMany({
      where: { stock_id: id },
    });
    return { status: 200, message: "Item Deleted." };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = deleteItem;
