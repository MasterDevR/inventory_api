const express = require("express");
const router = express.Router();
const updatePassword = require("../service/update-password");
const bcrypt = require("bcrypt");

router.post("/update-password", async (req, res) => {
  const { id, password, role } = req.body;

  try {
    const saltRounds = 10;

    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const response = await updatePassword(id, hashPassword, role);
    res.send(response);
  } catch (err) {
    console.log("Caught Error : ", err);
  }
});

module.exports = router;
