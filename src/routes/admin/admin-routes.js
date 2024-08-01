const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadImage = require("../../utils/upload-image");
const createItem = require("../../service/create-item");
const getItem = require("../../service/retrieve-item");
const getStockType = require("../../service/get-stock-type");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-new-supply", upload.single("image"), async (req, res) => {
  try {
    const files = req.file;
    const item = req.body;
    if (!files) {
      return res.status(400).send("No files uploaded.");
    }
    const result = await uploadImage(req.file);

    const response = await createItem(item, result);

    console.log(response);
    res.send(response);
  } catch (err) {
    console.log("CAUGHT ERROR /create-new-supply : ", err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get(`/get-item`, async (req, res) => {
  try {
    const item = await getItem();

    res.send(item);
  } catch (err) {
    console.log("Caught Error  /get-item: ", err.message);
  }
});

router.get("/get-stock-type", async (req, res) => {
  try {
    const stockType = await getStockType();
    res.send(stockType);
  } catch (error) {
    console.log("Caught Error /stock-type: ", error.message);
  }
});
module.exports = router;
