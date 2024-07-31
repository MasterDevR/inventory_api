const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  console.log(req.body);
  console.log("Received a POST request on the root");
  return res.send("Hello");
});

const adminRoutes = require("./routes/admin-route");
// admin routes
app.use("/admin", adminRoutes);

console.log("im in ");
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Application listening on port ${PORT}`);
});
