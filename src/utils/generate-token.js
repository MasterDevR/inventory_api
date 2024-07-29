const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretToken = process.env.SECRET_TOKEN;

const generateToken = async (data) => {
  try {
    const { id, role, department } = data.userData;

    const token = jwt.sign({ id, role, department }, secretToken);

    return token;
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = generateToken;
