const express = require("express");
const router = express.Router();
const multer = require("multer");
// Configure multer storag

const uploadImage = require("../../controllers/upload-inventory-image");
const createNewItem = require("../../controllers/create-item");
const findByName = require("../../controllers/find-by-name");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-new-supply", upload.single("image"), async (req, res) => {
  try {
    const newItem = req.body;
    const id = req.user;
    const { downloadURL } = await uploadImage(req.file, "item-image");

    const isExisting = await findByName(newItem);
    if (isExisting.isExist) {
      return res.send({
        status: 201,
        message:
          "Item Cannot Be Duplicated. Please Go To Add Item Quantity Section",
      });
    }
    await createNewItem({ ...newItem, downloadURL, id });

    res.send({ status: 200, message: "Item Created Successfully." });
  } catch (err) {
    console.log("CAUGHT ERROR: ", err.message);
    res.send({ status: 500, message: "Internal Serve Error." });
  }
});

module.exports = router;
