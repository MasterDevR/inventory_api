const createItem = require("../stock/create-stock");
const verifyStockExistance = require("../stock/verify-stock-existance");
const uploadImage = require("../../utils/upload-image");
const GetStockList = require("../stock/get-stock-list");
const searchItem = require("../stock/search-item");
const getStockType = require("../stock/get-stock-type");
const deleteStock = require("../stock/delete-stock");
const findStock = require("../stock/find-stock");
const AddStock = require("../stock/add-stock");
const GetEdticStock = require("../stock/get-edit-stock");
const updateEditedStock = require("../stock/update-edit-stock");
const stats = require("../stock/stats");
const GetStockReport = require("../stock/get-stock-report");
const getStockYearList = require("../stock/get-stock-year-list");
const StockDetails = require("../stock/stock-details");
const stockAllocation = require("../stock/get-stock-allocation");
const topStock = require("../stock/get-top-stock");
const stockSummary = require("../stock//get-stock-summary");
const StockCount = require("../../service/stock/stock-count");
const stockCard = require("../stock/get-stock-card");
const createNewStock = async (req, res) => {
  try {
    const item = req.body;
    const file = req.file;

    if (item === undefined) {
      return res.send({ status: 403, message: "Item Data Must Be inputted" });
    }

    const isExisting = await verifyStockExistance(item);
    if (isExisting.status === 200 || isExisting.status === 500) {
      res.send({ status: 403, message: "Item is existing." });

      return isExisting;
    }
    if (!file) {
      const result = await createItem(item, "");
      res.send(result);
      return;
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
    const count = await StockCount();
    const { search_item } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let item;
    if (search_item === "undefined") {
      item = await GetStockList(page, limit);
    } else {
      item = await searchItem(search_item, page, limit);
    }

    if (item.length === 0) {
      return res.send({ status: 404, message: "No Data Found" });
    }

    const totalPages = Math.ceil(count / limit);
    res.send({
      status: 200,
      count,
      totalPages,
      page,
      limit,
      item,
    });
  } catch (err) {
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const getAvailableStock = async (req, res) => {
  try {
    const count = await StockCount();
    const { search_item } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let item;
    if (search_item === "undefined") {
      item = await GetStockList(page, limit);
    } else {
      item = await searchItem(search_item, page, limit);
    }

    if (item.length === 0) {
      return res.send({ status: 404, message: "No Data Found" });
    }

    const totalPages = Math.ceil(count / limit);
    res.send({
      status: 200,
      count,
      totalPages,
      page,
      limit,
      item,
    });
  } catch (err) {
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
    const result = await GetEdticStock(stock_no);
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
    if (!data || Object.keys(data).length !== 8) {
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
    const result = await updateEditedStock(stock_no, data, file);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};
const getStats = async (req, res) => {
  const result = await stats();
  res.send(result);
};
const getItemReport = async (req, res) => {
  try {
    const { stock, year } = req.params;
    const result = await GetStockReport(stock, year);
    res.send(result);
  } catch (error) {
    return { status: 500, message: "Something Went Wrong." };
  }
};

const getStockYear = async (req, res) => {
  try {
    let result = await getStockYearList();

    result = result.map((stock) => {
      return {
        ...stock,
        stockHistories: stock.stockHistories.map((history) => {
          const createdAt = new Date(history.created_at);
          return {
            name: createdAt.getFullYear().toString(),
          };
        }),
      };
    });

    res.send({ status: 200, result });
  } catch (error) {
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};
const getStockDetails = async (req, res) => {
  try {
    const { stockno } = req.params;
    const result = await StockDetails(stockno);

    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
};

const getStockAllocation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await stockAllocation(id);

    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
};
const getTopStock = async (req, res) => {
  const result = await topStock();
  res.send(result);
};

const getStockSummary = async (req, res) => {
  try {
    const { year, month } = req.params;
    if (year === "undefined" && !year && year !== "") {
      res.send({ status: 403, message: "Year is missing." });
    }
    const result = await stockSummary(year, month);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const getStockCard = async (req, res) => {
  const { stock_no, year, month } = req.params;
  const result = await stockCard(stock_no, year, month);
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
  getStats,
  getItemReport,
  getStockYear,
  getStockDetails,
  getAvailableStock,
  getStockAllocation,
  getTopStock,
  getStockSummary,
  getStockCard,
};
