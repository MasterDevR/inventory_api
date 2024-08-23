const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const transaction = require("../controllers/transaction-controllers");

router.get("/get-transaction-purposes", transaction.getTransactionPurpose);
router.post(
  "/create-transaction/:departmentId",
  upload.none(),
  transaction.createTransaction
);

module.exports = router;
