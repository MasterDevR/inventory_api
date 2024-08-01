const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const deleteItem = async (id) => {
  try {
    await prisma.stock.delete({
      where: { id },
    });
    return { status: 200, message: "Item Deleted." };
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = deleteItem;
