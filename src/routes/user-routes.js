const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const userRoutes = require("../controllers/users-controllers");

const transaction = require("../controllers/transaction-controllers");

router.get("/get-transaction-purposes", transaction.getTransactionPurpose);
router.post(
  "/create-transaction/:departmentId",
  upload.none(),
  transaction.createTransaction
);
router.get(
  "/get-transaction-history/:department_id/:id",
  transaction.getTransactionHistory
);

router.get("/user-notification/:department_id", transaction.getNotification);

router.get("/user-icon/:department_id", userRoutes.getUserIcon);
router.put(
  "/change-password/:department_id",
  upload.none(),
  userRoutes.changePassword
);
// router.post("/verify-email/", userRoutes.verifyEmailController);
// router.post("/verify-otp", userRoutes.verifyOTPController);
router.put(
  "/change-email/:department_id",
  upload.none(),
  userRoutes.changeEmailController
);
router.get("/edit-transaction/:id", transaction.GetEditTransaction);
router.put("/modify-transactions/:id", transaction.PutEditTransaction);
router.delete("/delete-transactions/:id", transaction.DeleteTransaction);
router.put("/update-notification", transaction.updateNotification);
router.post(
  "/generate-request-otp/:department_id",
  transaction.generateOtpController
);
router.post("/verify-otp/:department_id", transaction.verifyOtpController);
module.exports = router;
