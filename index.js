const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const session = require("express-session");
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000 },
    sameSite: "none",
  })
);

const adminRoutes = require("./src/routes/admin-routes");
const usersRoutes = require("./src/routes/user-routes");
const loginRoute = require("./src/routes/login-route");
const logoutRoute = require("./src/routes/logout-route");
const settingRoutes = require("./src/routes/setting-routes");
const verifyTokenRoutes = require("./src/routes/validate-token");
const validateToken = require("./src/routes/validate-token");
const tokenValidator = require("./src/middlewares/admin-middleware");

const verifyEmailRoute = require("./src/routes/verify-email");
const verifyOTPRoute = require("./src/routes/verify-otp");

app.use("/admin", tokenValidator, adminRoutes);
app.use("/user", tokenValidator, usersRoutes);
app.use("/validate-token", validateToken);
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);
app.use("/setting", settingRoutes);
app.use("/verify-token", verifyTokenRoutes);

app.use("/verify-email", verifyEmailRoute);
app.use("/verify-otp", verifyOTPRoute);
// // server port
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});
