const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createItem = require("../service/create-stock");
const verifyStockExistance = require("../service/verify-stock-existance");
const uploadImage = require("../utils/upload-image");
const GetStockList = require("../service/get-stock-list");
const getStockType = require("../service/get-stock-type");
const deleteStock = require("../service/delete-stock");
const findStock = require("../service/find-stock");
const AddStock = require("../service/add-stock");
const GetEdticStock = require("../service/get-edit-stock");
const updateEditedStock = require("../service/update-edit-stock");
const GetTopStock = require("../service/get-top-stock");

const createNewStock = async (req, res) => {
  try {
    const item = req.body;
    const file = req.file;

    if (!file || item === undefined) {
      return res.send({ status: 403, message: "Item Data Must Be inputted" });
    }
    const isExisting = await verifyStockExistance(item);
    if (isExisting.status === 200 || isExisting.status === 500) {
      return isExisting;
    }
    const imageURL = await uploadImage(req.file, "file");
    const result = await createItem(item, imageURL);
    res.send(result);
  } catch (err) {
    console.log("CAUGHT ERROR /create-new-supply : ", err);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const getStockList = async (req, res) => {
  try {
    const result = await GetStockList();
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

const removeStock = async (req, res) => {
  const { stock_no } = req.params;
  console.log("sadfasf");
  try {
    const findStockByStock_no = await findStock(stock_no);

    if (findStockByStock_no.status === 404) {
      const result = await deleteStock(stock_no);
      res.send(result);
    } else {
      res.send(findStockByStock_no);
    }
  } catch (error) {
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const addStock = async (req, res) => {
  try {
    const { stock_no } = req.params;
    const data = req.body;
    const result = await AddStock(stock_no, data);
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Internal Server Error." });
  }
};

const getEditStock = async (req, res) => {
  try {
    const { stock_no } = req.params;
    if (stock_no === undefined) {
      return { status: 404, message: "Cannot find Stock number." };
    }
    const result = GetEdticStock(stock_no);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.send({ status: 500, message: "Internal Server Error." });
  }
};

const putEditedStock = async (req, res) => {
  try {
    const { stock_no } = req.params;
    const data = req.body;
    const file = req.file;
    if (!data || Object.keys(data).length !== 10) {
      return res.send({
        status: 404,
        message: "Item canno be updated with an empty value.",
      });
    }
    for (const i in data) {
      if (data[i] === undefined || data[i] === "" || data[i] === null) {
        return res.send({
          status: 400,
          message: "Item canno be updated with an empty value.",
        });
      }
    }
    const result = updateEditedStock(stock_no, data, file);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
};
const getTopStock = async (req, res) => {
  const result = await GetTopStock();
  res.send(result);
};
module.exports = {
  createNewStock,
  getStockList,
  stockType,
  removeStock,
  addStock,
  getEditStock,
  putEditedStock,
  getTopStock,
};
