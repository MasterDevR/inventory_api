const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
const adminRoutes = require("./src/routes/admin/admin-routes");
const loginRoute = require("./src/routes/login/login-route");

// protected routes
app.use("/admin", adminRoutes);

// public routes
app.use("/login", loginRoute);

// server port
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});
