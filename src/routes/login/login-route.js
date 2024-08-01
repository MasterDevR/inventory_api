const express = require("express");
const router = express.Router();
const authenticate = require("../../controllers/authenticate-user");
const generateToken = require("../../utils/generate-token");

router.post("/", async (req, res) => {
  try {
    const { credentials } = req.body;
    console.log(credentials);
    const response = await authenticate(credentials);

    if (response.status === 404 || response.status === 401) {
      res.send(response);
      return;
    }

    const Token = await generateToken(response.findUser);

    const filteredUserData = Object.fromEntries(
      Object.entries(response.findUser).filter(([key]) => key !== "password")
    );

    console.log({ ...filteredUserData, accessToken: Token });
    res.send({
      status: 200,
      data: {
        userData: {
          ...filteredUserData,
          _id: filteredUserData.id,
          accessToken: Token,
        },
      },
    });
  } catch (err) {
    console.log(err.message);
    return {
      status: 500,
      message: "Internal Server Error. Please Contact Admin",
    };
  }
});

module.exports = router;
