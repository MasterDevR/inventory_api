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
// protected routes
app.use("/admin", adminRoutes);

// public routes
app.use("/login", loginRoute);
app.use("/logout", logoutRoute);

app.use("/setting", settingRoutes);
app.use("/verify-token", verifyTokenRoutes);
// server port
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log("Server is running on PORT : ", PORT);
});

// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const myPlaintextPassword = "password";
// const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// console.log(hash);
// console.log(bcrypt.compareSync(myPlaintextPassword, hash));

// const createAdmin = require("./src/controllers/create-admin");
// const createUser = require("./src/controllers/create-users");
// createAdmin();
// createUser();
// $2b$10$sEygJjPV0hF4L83m.eenpOIUwXJc1f3RUmZHpiB1xGQr0SEpBZxUO;
