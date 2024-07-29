const express = require("express");
const router = express.Router();
const authenticate = require("../../controllers/authenticate-user");
const generateToken = require("../../utils/generate-token");

router.post("/", async (req, res) => {
  try {
    const { credentials } = req.body;
    const response = await authenticate(credentials);

    if (response.status === 404 || response.status === 401) {
      res.send(response);
      return;
    }

    const Token = await generateToken(response);
    if (!Token && !refreshToken) {
      res.send({ status: 200, message: "cannot create token" });
    }

    const filteredUserData = Object.fromEntries(
      Object.entries(response.userData).filter(([key]) => key !== "password")
    );

    res.send({
      status: 200,
      data: { useData: { ...filteredUserData, accessToken: Token } },
    });
  } catch (err) {
    return {
      status: 500,
      message: "Internal Server Error. Please Contact Admin",
    };
  }
});

module.exports = router;
