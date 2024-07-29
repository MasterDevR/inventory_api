const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("im in");
  console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token);
    req.user = decoded;
    console.log(decoded);
    res.send({ status: 200 });
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = adminMiddleware;
