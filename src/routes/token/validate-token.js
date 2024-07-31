const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretToken = process.env.SECRET_TOKEN;

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(200).send({ error: "Token is required", status: 400 });
    }

    const decoded = jwt.verify(token, secretToken);
    res.send({ status: 200, decoded });
  } catch (err) {
    res
      .status(200)
      .send({ isValidated: false, error: "Invalid token", status: 401 });
  }
});

module.exports = router;
