const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  return res.send("Hello from admin");
});

export default router;
