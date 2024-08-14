const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getStorage, ref, deleteObject } = require("firebase/storage");
const createItem = require("../../../service/create-item");
const checkMatchItem = require("../../../service/item/check-match-item");
const UniquiItem = require("../../../utils/unique-item-checker");
const uploadImage = require("../../../utils/upload-image");
const getItems = require("../../../service/retrieve-item");
const getStockType = require("../../../service/get-stock-type");
const deleteItem = require("../../../service/delete-item");
const findItem = require("../../../service/findItem");
const addItemStock = require("../../../service/item/addItemStock");

const createNewSupply = async (req, res) => {
  try {
    const item = req.body;
    const file = req.file;
    // check if has a item data
    if (!file || item === undefined) {
      return res.send({ status: 403, message: "Item Data Must Be inputted" });
    }
    // check if item is existing
    const isExisting = await checkMatchItem(item);
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
  const { stock_no } = req.params;
  try {
    const findItemById = await findItem(stock_no);

    if (findItemById.status === 404) {
      const result = await deleteItem(stock_no);
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
    console.log(result);
    res.send(result);
  } catch (error) {
    res.send({ status: 500, message: "Internal Server Error." });
  }
};

const getEditItem = async (req, res) => {
  try {
    const { stock_no } = req.params;
    if (stock_no === undefined) {
      return { status: 404, message: "Cannot find Stock number." };
    }
    const history = await prisma.stock_history.findFirst({
      where: {
        stock_no: stock_no,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        quantity: true,
      },
    });
    const stock = await prisma.stock.findUnique({
      where: {
        stock_no: stock_no,
      },
      select: {
        item: true,
        price: true,
        description: true,
        measurement: true,
        stock_no: true,
        re_order_point: true,
        distributor: true,
        consume_date: true,
        reference: true,
        image: true,
      },
    });
    const itemData = [{ ...stock, quantity: history.quantity }];
    if (stock.length <= 0) {
      return { status: 404, message: "Cannot find Item." };
    }
    res.send({ status: 200, data: itemData });
  } catch (error) {
    console.log(error.message);
    res.send({ status: 500, message: "Internal Server Error." });
  }
};

const putEditItem = async (req, res) => {
  try {
    const { stock_no } = req.params;
    const data = req.body;
    const file = req.file;
    let latestStockNo = stock_no;
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

    // check if stock number modified
    if (stock_no !== data.stock_no) {
      latestStockNo = data.stock_no;
      await prisma.$transaction(async (prisma) => {
        await prisma.stock.update({
          where: {
            stock_no: stock_no,
          },
          data: {
            stock_no: latestStockNo,
          },
        });
        await prisma.stock_history.updateMany({
          where: {
            stock_no: stock_no,
          },
          data: {
            stock_no: latestStockNo,
          },
        });
      });
    }

    // find latest history
    const latestHistory = await prisma.stock_history.findFirst({
      where: {
        stock_no: latestStockNo,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (latestHistory) {
      await prisma.stock_history.update({
        where: {
          id: latestHistory.id,
        },
        data: {
          price: +data.price,
          quantity: +data.quantity,
          distributor: data.distributor,
        },
      });
    }

    const stockRecord = await prisma.stock.findUnique({
      where: {
        stock_no: latestStockNo,
      },
      select: {
        total_quantity_request: true,
      },
    });

    const totalQuantity = await prisma.stock_history.aggregate({
      where: {
        stock_no: latestStockNo,
      },
      _sum: {
        quantity: true,
      },
    });

    const latestQuantity =
      totalQuantity._sum.quantity - stockRecord.total_quantity_request;

    let itemImage = await prisma.stock.findUnique({
      where: { stock_no: latestStockNo },
      select: {
        image: true,
      },
    });

    if (file !== undefined) {
      const storage = getStorage();

      const filePath = itemImage.image
        .split("/o/")[1]
        .split("?")[0]
        .replace(/%2F/g, "/");

      const fileRef = ref(storage, filePath);
      deleteObject(fileRef);

      itemImage = await uploadImage(req.file, "file");
    }

    await prisma.stock.update({
      where: {
        stock_no: latestStockNo,
      },
      data: {
        item: data.name,
        price: +data.price,
        quantity: latestQuantity,
        description: data.description,
        measurement: data.measurement,
        re_order_point: data.order,
        reference: data.reference,
        consume_date: +data.consume,
        distributor: data.distributor,
        image: itemImage.image,
      },
    });

    res.send({ status: 200, message: "Item Updated." });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewSupply,
  getItemList,
  stockType,
  removeItem,
  addStock,
  getEditItem,
  putEditItem,
};
