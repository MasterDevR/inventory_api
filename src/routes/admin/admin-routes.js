const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const createUserHandler = require("../../controllers/create-users");
router.get("/", (req, res) => {
  res.send("get all users");
});

router.post("/create-user", upload.none(), async (req, res) => {
  await createUserHandler(req.body);
  res.send("get all users");
});
module.exports = router;
