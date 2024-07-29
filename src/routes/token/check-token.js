const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretToken = process.env.SECRET_TOKEN;

router.post("/", (req, res) => {
  console.log("im in token");
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, secretToken);
    res.send({ status: 200, message: "Token is valid" });
  } catch (err) {
    return res.send({ status: 401, message: "Token expired or invalid" });
  }
});

module.exports = router;
