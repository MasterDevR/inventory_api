const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(helmet()); // layer of security
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route
const adminRoutes = require("./src/routes/admin/admin-routes");
const loginRoute = require("./src/routes/login/login-route");
const logoutRoute = require("./src/routes/logout/logout");
const settingRoutes = require("./src/routes/setting/setting-routes");
const verifyTokenRoutes = require("./src/routes/token/validate-token");
const validateToken = require("./src/routes/token/validate-token");
const adminMiddleware = require("./src/middlewares/admin-middleware");
// protected routes
app.use("/admin", adminMiddleware, adminRoutes);

// public routes
app.use("/validate-token", validateToken);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);

app.use("/setting", settingRoutes);
app.use("/verify-token", verifyTokenRoutes);

// const craeteNewUser = require("./src/service/create-users");
// craeteNewUser();

// // server port
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});
