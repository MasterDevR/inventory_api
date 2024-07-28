const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create-new-supply",
  upload.fields([{ name: "image", maxCount: 1 }]),
  (req, res) => {
    console.log("im in");
    try {
      const files = req.files;
      if (!files || !files.image) {
        return res.status(400).send("No files uploaded.");
      }

      console.log("File uploaded: ", files.image[0]);
      console.log("Request body: ", req.body);

      res.send("File uploaded successfully");
    } catch (err) {
      console.log("CAUGHT ERROR: ", err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
