const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
router.post("/", (req, res) => {
  res.send({ status: 200 });
});

module.exports = router;
