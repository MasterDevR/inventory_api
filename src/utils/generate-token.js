const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretToken = process.env.SECRET_TOKEN;

const generateToken = async (data) => {
  try {
    const { id, role } = data;
    const token = jwt.sign({ id, role }, secretToken, { expiresIn: "1d" });

    return token;
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = generateToken;
