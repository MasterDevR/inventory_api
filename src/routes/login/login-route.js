const express = require("express");
const router = express.Router();
const authenticate = require("../../controllers/authenticate-user");
const generateToken = require("../../utils/generate-token");
const generateRefreshToken = require("../../utils/generate-refresh-token");
const createRefreshToken = require("../../controllers/create-refresh-token");
router.post("/", async (req, res) => {
  try {
    const user_credential = req.body;
    const response = await authenticate(user_credential);

    if (response.status === 404 || response.status === 401) {
      res.send(response);
      return;
    }
    const Token = await generateToken(response);
    const refreshToken = await generateRefreshToken(response);

    if (!Token && !refreshToken) {
      res.send({ status: 200, message: "cannot create token" });
    }
    const { userData } = response;
    await createRefreshToken(refreshToken, userData.role, userData.id);
    res.send({
      status: 200,
      data: { response, Token: Token },
    });
  } catch (err) {
    console.log(err);

    return {
      status: 500,
      message: "Internal Server Error. Please Contact Admin",
    };
  }
});

module.exports = router;
