const createItem = require("../../../service/create-item");
const checkMatches = require("../../../service/item/check-match-item");
const UniquiItem = require("../../../utils/unique-item-checker");
const uploadImage = require("../../../utils/upload-image");
const getItems = require("../../../service/retrieve-item");
const getStockType = require("../../../service/get-stock-type");
const deleteItem = require("../../../service/delete-item");
const findItem = require("../../../service/findItem");
const addItemStock = require("../../../service/item/addItemStock");

const createNewSupply = async (req, res) => {
  try {
    const items = req.body.items;
    const files = req.files;
    // check if has a item data
    if (!files || Object.keys(files).length === 0 || items.length <= 0) {
      return res.send({ status: 403, message: "Item Data Must Be inputted" });
    }

    const objects = items.map((jsonString) => JSON.parse(jsonString));

    // check if there's no duplicated in items[]
    const isUnique = await UniquiItem(objects);
    if (isUnique.status !== 200) {
      return res.send(isUnique);
    }

    // check if item in items[] is no similar data on the database.
    const checkMactchItem = await checkMatches(objects);
    if (checkMactchItem.status === 403) {
      return res.send(checkMactchItem);
    }
    const itemImages = await uploadImage(req.files, "file");
    const objectItem = objects.map((obj, index) => {
      return { ...obj, image: itemImages[index] };
    });
    const result = await createItem(objectItem);
    res.send(result);
  } catch (err) {
    console.log("CAUGHT ERROR /create-new-supply : ", err);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const getItemList = async (req, res) => {
  try {
    const result = await getItems();
    res.send(result);
  } catch (err) {
    console.log("Caught Error  /get-item: ", err.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const stockType = async (req, res) => {
  try {
    const result = await getStockType();
    res.send(result);
  } catch (error) {
    console.log("Caught Error /stock-type: ", error.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const removeItem = async (req, res) => {
  const { stock_no, id } = req.params;
  try {
    const findItemById = await findItem(stock_no);

    if (findItemById.status === 404) {
      const result = await deleteItem(stock_no, id);
      res.send(result);
    } else {
      res.send(findItemById);
    }
  } catch (error) {
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const addStock = async (req, res) => {
  try {
    const { stock_no } = req.params;
    const data = req.body;
    const result = await addItemStock(stock_no, data);
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Internal Server Error." });
  }
};

const editItem = async (req, res) => {
  const id = req.params;
};

module.exports = {
  createNewSupply,
  getItemList,
  stockType,
  removeItem,
  addStock,
  editItem,
};
