const jwt = require("jsonwebtoken");
require("dotenv").config();

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const generateRefreshToken = async (data) => {
  try {
    const { id, role } = data.userData;
    const refreshToken = jwt.sign({ id, role }, REFRESH_TOKEN);
    return refreshToken;
  } catch (error) {
    console.log("ERROR:", error);
  }
};

module.exports = generateRefreshToken;
