const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const adminRoutes = require("./src/routes/admin-routes");
const usersRoutes = require("./src/routes/user-routes");
const loginRoute = require("./src/routes/login-route");
const logoutRoute = require("./src/routes/logout-route");
const settingRoutes = require("./src/routes/setting-routes");
const verifyTokenRoutes = require("./src/routes/validate-token");
const validateToken = require("./src/routes/validate-token");
const adminMiddleware = require("./src/middlewares/admin-middleware");

app.use("/admin", adminMiddleware, adminRoutes);
app.use("/user", adminMiddleware, usersRoutes);
app.use("/validate-token", validateToken);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/setting", settingRoutes);
app.use("/verify-token", verifyTokenRoutes);

// // server port
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});
