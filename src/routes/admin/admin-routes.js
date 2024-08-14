const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const itemRoutes = require("./item/item-routes");
const userRoutes = require("./user/user-route");
// item routes
router.post(
  "/create-new-supply",
  upload.single("image"),
  itemRoutes.createNewSupply
);
router.get(`/get-item`, itemRoutes.getItemList);
router.get("/get-stock-type", itemRoutes.stockType);
router.delete("/delete-item/:stock_no", itemRoutes.removeItem);
router.post("/add-stock/:stock_no", upload.none(), itemRoutes.addStock);
router.get("/edit-item/:stock_no", itemRoutes.getEditItem);
router.put(
  "/edit-item/:stock_no",
  upload.single("image"),
  itemRoutes.putEditItem
);
// User routes
router.get("/get-all-user", userRoutes.getUsers);
router.get(`/get-user-role`, userRoutes.getRoles);
router.post("/create-user", upload.single("image"), userRoutes.createNewUser);

module.exports = router;
