const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadImage = require("../../utils/upload-image");
const createItem = require("../../service/create-item");

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
    console.log("CAUGHT ERROR: ", err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
