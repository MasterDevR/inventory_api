const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// routes
const itemsRoutes = require("../service/user/item-controllers");
const usersRoutes = require("../controllers/users-controllers");
const transactionRoutes = require("../controllers/transaction-controllers");
const notification = require("../controllers/notification-controllers");
router.post(
  "/create-stock",
  upload.single("image"),
  itemsRoutes.createNewStock
);
router.get(`/get-stock/:search_item`, itemsRoutes.getStockList);
router.get(`/get-available-stock/:search_item`, itemsRoutes.getAvailableStock);
router.get("/get-stock-type", itemsRoutes.stockType);
router.delete("/delete-stock/:stock_no", itemsRoutes.removeStock);
router.post("/add-stock/:stock_no", upload.none(), itemsRoutes.addStock);
router.get("/edit-stock/:stock_no", itemsRoutes.getEditStock);
router.put(
  "/edit-stock/:stock_no",
  upload.single("image"),
  itemsRoutes.putEditedStock
);
router.get("/get-stats", itemsRoutes.getStats);
router.get("/get-top-stock", itemsRoutes.getTopStock);
router.get("/get-stock-report/:stock/:year", itemsRoutes.getItemReport);
router.get("/get-stock-year", itemsRoutes.getStockYear);
router.get("/stock-details/:stockno", itemsRoutes.getStockDetails);
router.get("/stock-allocation/:id", itemsRoutes.getStockAllocation);
router.get("/stock-summary/:year/:month", itemsRoutes.getStockSummary);

// user
router.get("/get-all-user", usersRoutes.getUsers);
router.get(`/get-user-role`, usersRoutes.getRoles);
router.post("/create-user", upload.single("image"), usersRoutes.createNewUser);
router.get("/get-requestor-type", usersRoutes.RequestorType);
// transaction
router.get(
  "/get-all-transaction/:status/:search_data",
  transactionRoutes.getAllTransaction
);
router.put(
  "/approve-transaction",
  upload.none(),
  transactionRoutes.approveTransaction
);
router.put(
  "/reject-transaction",
  upload.none(),
  transactionRoutes.rejectTransaction
);
router.put(
  "/ready-transaction",
  upload.none(),
  transactionRoutes.readyTransaction
);
router.get(
  "/get-all-transaction-status",
  transactionRoutes.getAllTransactionStatus
);

router.get("/admin-notification", notification.getAdminNotification);
router.put("/update-notification", notification.updateNotification);
module.exports = router;
