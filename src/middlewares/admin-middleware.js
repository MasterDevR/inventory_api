const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretToken = process.env.SECRET_TOKEN;

const adminMiddleware = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // if (token === undefined) {
    //   res.send({ status: 404, message: "Unauthorized Access" });
    // }

    // let decoded = jwt.verify(token, secretToken);

    // if (decoded.role !== "RECEIVER" || decoded.role !== "APPROVER") {
    //   res.send({ status: 401, message: "Unauthorized Access" });
    // } else {
    //   req.user = decoded;
    //   next();
    // }
    next();
  } catch (err) {
    res
      .status(200)
      .send({ isValidated: false, error: "Invalid token", status: 401 });
  }
};
module.exports = adminMiddleware;
