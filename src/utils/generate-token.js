const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretToken = process.env.SECRET_TOKEN;

const generateToken = async (data) => {
  try {
    const { id, Role } = data;
    const { name } = Role;

    const token = jwt.sign({ id, name }, secretToken, { expiresIn: "1d" });

    return token;
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = generateToken;
