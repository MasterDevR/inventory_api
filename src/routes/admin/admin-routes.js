const express = require("express");
const router = express.Router();
const multer = require("multer");
// Configure multer storag

const uploadImage = require("../../controllers/upload-inventory-image");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create-new-supply", upload.single("image"), async (req, res) => {
  console.log("im in");
  try {
    // Log the request body fields
    console.log("Request body: ", req.body);

    const result = await uploadImage(req.file, "item-image");

    // Log the uploaded file details
    console.log("File uploaded: ", result);

    res.send({ status: 200, path: result.downloadURL });
  } catch (err) {
    console.log("CAUGHT ERROR: ", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
