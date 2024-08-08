const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const itemRoutes = require("./item/item-routes");
const userRoutes = require("./user/user-route");

// item routes
router.post(
  "/create-new-supply",
  upload.fields([{ name: "image" }]),
  itemRoutes.createNewSupply
);
router.get(`/get-item`, itemRoutes.getItemList);
router.get("/get-stock-type", itemRoutes.stockType);
router.delete("/delete-item/:stock_no/:id", itemRoutes.removeItem);
router.post("/add-stock/:stock_no", itemRoutes.addStock);
router.post("/edit-item/:id", itemRoutes.editItem);
// User routes
router.get("/get-all-user", userRoutes.getUsers);
router.get(`/get-user-role`, userRoutes.getRoles);
router.post("/create-user", upload.single("image"), userRoutes.createNewUser);

module.exports = router;
