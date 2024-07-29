const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretToken = process.env.SECRET_TOKEN;

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const decoded = jwt.verify(token, secretToken);

    if (decoded.department !== "admin") {
      return res.status(401).json({ message: "Access Denied." });
    }
    req.user = decoded.id;

    next();
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = adminMiddleware;
