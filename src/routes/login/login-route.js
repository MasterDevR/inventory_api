const express = require("express");
const router = express.Router();
const authenticate = require("../../controllers/authenticate-user");
let count = 0;

router.post("/", async (req, res) => {
  count++;
  console.log(count);
  try {
    const user_credential = req.body;
    const response = await authenticate(user_credential);
    // return if something is wrong
    if (response.status === 404 || response.status === 401) {
      res.send(response);
      return;
    }
    console.log(response);
    res.send(response);
  } catch (err) {
    return {
      status: 500,
      message: "Internal Server Error. Please Contact Admin",
    };
  }
});

module.exports = router;
