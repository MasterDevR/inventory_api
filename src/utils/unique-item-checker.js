const handler = async (itemData) => {
  try {
    const uniqueItems = [];
    for (let uniqueItem = 0; uniqueItem < itemData.length; uniqueItem++) {
      const currentItem = itemData[uniqueItem];
      const isUnique = !uniqueItems.some(
        (item) =>
          item.name === currentItem.name ||
          item.stock === currentItem.stock ||
          item.description === currentItem.description ||
          item.order === currentItem.order
      );

      if (isUnique) {
        uniqueItems.push({
          name: currentItem.name,
          stock: currentItem.stock,
          description: currentItem.description,
          order: currentItem.order,
        });
      } else {
        return {
          status: 403,
          message: `Item Must Be Unique`,
        };
      }
    }

    return { status: 200 };
  } catch (error) {
    console.log("item-checker : ", error.message);
    return { status: 500, message: "Internal Server Error." };
  }
};

module.exports = handler;
