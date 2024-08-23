const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// routes
const itemsRoutes = require("../controllers/item-controllers");
const usersRoutes = require("../controllers/users-controllers");
const transactionRoutes = require("../controllers/transaction-controllers");

router.post(
  "/create-stock",
  upload.single("image"),
  itemsRoutes.createNewStock
);
router.get(`/get-stock`, itemsRoutes.getStockList);
router.get("/get-stock-type", itemsRoutes.stockType);
router.delete("/delete-stock/:stock_no", itemsRoutes.removeStock);
router.post("/add-stock/:stock_no", upload.none(), itemsRoutes.addStock);
router.get("/edit-stock/:stock_no", itemsRoutes.getEditStock);
router.put(
  "/edit-stock/:stock_no",
  upload.single("image"),
  itemsRoutes.putEditedStock
);
router.get("/get-top-stock", itemsRoutes.getTopStock);

router.get("/get-all-user", usersRoutes.getUsers);
router.get(`/get-user-role`, usersRoutes.getRoles);
router.post("/create-user", upload.single("image"), usersRoutes.createNewUser);

router.get("/get-all-transaction", transactionRoutes.getAllTransaction);

module.exports = router;
