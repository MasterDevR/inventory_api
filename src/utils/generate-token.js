require("dotenv").config();

const jwt = require("jsonwebtoken");

const secretToken = process.env.SECRET_TOKEN;

const generateToken = async (data) => {
  console.log("token");
  jwt.sign(
    { data },
    secretToken,
    { algorithm: "RS256" },
    function (err, token) {
      if (err) {
        console.log("ERROR ", err);
      }
      console.log(token);
    }
  );
};

module.exports = generateToken;
