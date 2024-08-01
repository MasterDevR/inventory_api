const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadImage = require("../../utils/upload-image");

// Item import section
const createItem = require("../../service/create-item");
const getItem = require("../../service/retrieve-item");
const getStockType = require("../../service/get-stock-type");
const deleteItem = require("../../service/delete-item");
const findItem = require("../../service/findItem");

// uesr import section
const userRole = require("../../service/get-user-role");
const createUser = require("../../service/create-user");
const findUser = require("../../service/find-user");
const getAllUser = require("../../service/get-all-user");

// multer
const upload = multer({ storage: multer.memoryStorage() });
// Item Section
router.post("/create-new-supply", upload.single("image"), async (req, res) => {
  try {
    const files = req.file;
    const item = req.body;
    if (!files) {
      return res.status(400).send("No files uploaded.");
    }
    const result = await uploadImage(req.file, "file");

    const response = await createItem(item, result);

    console.log(response);
    res.send(response);
  } catch (err) {
    console.log("CAUGHT ERROR /create-new-supply : ", err.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});

router.get(`/get-item`, async (req, res) => {
  try {
    const item = await getItem();

    res.send(item);
  } catch (err) {
    console.log("Caught Error  /get-item: ", err.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});

router.get("/get-stock-type", async (req, res) => {
  try {
    const stockType = await getStockType();
    res.send(stockType);
  } catch (error) {
    console.log("Caught Error /stock-type: ", error.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});

router.delete("/delete-item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findItemById = await findItem(id);
    if (findItemById.status === 404) {
      const result = await deleteItem(id);
      res.send(result);
    } else {
      console.log(findItemById);
      res
        .status(403)
        .json({ message: "Cannot Delete An Item It already Requested" });
    }
  } catch (error) {
    console.log(error.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});

router.put("/update-item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findItemById = await findItem(id);
    if (findItemById.status === 404) {
      res.send(result);
    } else {
      console.log(findItemById);
      res.send(result);
    }
  } catch (error) {
    console.log(error.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});

// User Section
router.get("/get-all-user", async (req, res) => {
  try {
    const users = await getAllUser();
    res.send(users);
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  }
});
router.get(`/get-user-role`, async (req, res) => {
  try {
    const result = await userRole();
    res.send(result);
  } catch (err) {
    console.log("Caught Error  /get-user-role: ", err.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
});
router.post("/create-user", upload.single("image"), async (req, res) => {
  try {
    const files = req.file;
    const userData = req.body;
    let imageSrc = "";

    if (files) {
      imageSrc = await uploadImage(files, "user");
    }

    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .send({ status: 400, message: "User data is missing" });
    }

    const isExisting = await findUser(userData);
    if (isExisting.status === 404) {
      await createUser({ ...userData, imageSrc });
      res.send({ status: 200, message: "User created successfully" });
    }

    console.log(isExisting);
    res.send({
      status: 403,
      message: "Creation Failed. User Is Already Existing.",
    });
  } catch (err) {
    console.log("CAUGHT ERROR /create-user : ", err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
