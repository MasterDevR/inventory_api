const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const GetAllTransaction = require("../service/transaction/get-all-transaction");
const getTransactionByStatus = require("../service/transaction/get-transaction-by-status");
const CreateTransaction = require("../service/transaction/create-transaction");
const GetTransactionPurpose = require("../service/transaction/get-transaction-purpose");
const Transaction = require("../service/transaction/approve-transaction");
const transactionReject = require("../service/transaction/reject-transaction");
const createAdminNotification = require("../service/notification/create-admin-notification");
const searchTransaction = require("../service/transaction/search-transaction");
const getTransactionsByStatusAndSearch = require("../service/transaction/get-all-transaction-by-status-and-search_data");
const transactionReady = require("../service/transaction/ready-transaction");
const getAllTransactionByUser = require("../service/transaction/get-all-transaction-by-user");
const notification = require("../service/notification/get-user-notification");

const getAllTransaction = async (req, res) => {
  let result;
  try {
    const { status, search_data } = req.params;
    if (
      status === "undefined" ||
      (status === "all" && search_data === "undefined")
    ) {
      result = await GetAllTransaction();
    } else if (
      status !== "all" &&
      status !== "undefined" &&
      search_data === "undefined"
    ) {
      result = await getTransactionByStatus(status);
    } else if (search_data !== "undefined" && status === "undefined") {
      result = await searchTransaction(search_data);
    } else if (status && search_data) {
      result = await getTransactionsByStatusAndSearch(status, search_data);
    }

    const formattedResult = result.map((item) => ({
      ...item,
      created_at: new Date(item.created_at).toISOString().split("T")[0],
    }));
    res.send({ status: 200, data: formattedResult, result: result.data });
  } catch (error) {
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};

const createTransaction = async (req, res) => {
  try {
    const data = req.body;
    const { departmentId } = req.params;

    const purpose = data.purpose || data[5];
    const combinedData =
      data.quantity.length > 1
        ? data.description?.map((desc, index) => ({
            item: data.item[index],
            description: desc,
            price: data.price[index],
            stock: data.stock[index],
            quantity: data.quantity[index],
          }))
        : data;

    const result = await CreateTransaction(combinedData, purpose, departmentId);
    if (result.status === 200) {
      await createAdminNotification(
        data.quantity.length,
        purpose,
        departmentId,
        result.id
      );
    }

    res.send(result);
  } catch (error) {
    console.log(error.message);
    return { status: 500, message: "Someting Went Wrong." };
  }
};
const getTransactionPurpose = async (req, res) => {
  try {
    const result = await GetTransactionPurpose();
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Something Went Wrong." });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const obj = Object.assign({}, req.body);
    const result = await Transaction(obj);

    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Something went wrong." });
  }
};
const rejectTransaction = async (req, res) => {
  try {
    const data = Object.assign({}, req.body);
    const result = await transactionReject(data);
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Something went wrong." });
  }
};
const readyTransaction = async (req, res) => {
  try {
    const data = Object.assign({}, req.body);
    const result = await transactionReady(data);

    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Something went wrong." });
  }
};
const getAllTransactionStatus = async (req, res) => {
  try {
    let result = await prisma.transaction_status.findMany();

    const allRecord = {
      id: "new-unique-id",
      name: "all",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    result.unshift(allRecord);
    res.send({ status: 200, result });
  } catch (error) {
    res.send({ status: 500, message: "Something went wrong." });
  }
};

const getTransactionHistory = async (req, res) => {
  const { department_id, id } = req.params;
  const result = await getAllTransactionByUser(department_id, id);
  res.send(result);
};
const getNotification = async (req, res) => {
  try {
    const { department_id } = req.params;
    const result = await notification(department_id);
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Something Went Wrong" });
  }
};
module.exports = {
  getAllTransaction,
  createTransaction,
  getTransactionPurpose,
  approveTransaction,
  rejectTransaction,
  getAllTransactionStatus,
  readyTransaction,
  getTransactionHistory,
  getNotification,
};
