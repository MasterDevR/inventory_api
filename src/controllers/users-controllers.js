const getAllUser = require("../service/user/get-all-user");
const uploadImage = require("../utils/upload-image");
const userRole = require("../service/user/get-user-role");
const createUser = require("../service/user/create-user");
const findUser = require("../service/user/find-user");
const userIcon = require("../service/user/get-user-icon");
const updatePassword = require("../service/user/update-password");
const verifyOTP = require("../service/email/verify-otp");
const verifyEmail = require("../service/email/verify-email");
const sendOTP = require("../service/email/send-otp");
const changeEmail = require("../service/user/change-email");
const getRequestorType = require("../service/user/requestor-type");
const getUsers = async (req, res) => {
  try {
    const users = await getAllUser();
    res.send(users);
  } catch (error) {
    return { status: 500, message: "Internal Server Error." };
  }
};

const getRoles = async (req, res) => {
  try {
    const result = await userRole();
    res.send(result);
  } catch (err) {
    console.log("Caught Error  /get-user-role: ", err.message);
    res.send({ status: 500, message: "Internal Server Error" });
  }
};

const createNewUser = async (req, res) => {
  try {
    const files = req.file;
    const userData = req.body;
    let imageSrc = "";
    if (files) {
      imageSrc = await uploadImage(files, "user");
    }

    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .send({ status: 400, message: "User data is missing" });
    }
    const isExisting = await findUser(userData);
    if (isExisting.status === 404) {
      const result = await createUser({ ...userData, imageSrc });
      return res.send(result);
    }

    res.send({
      status: 403,
      message: "Creation Failed. User Is Already Existing.",
    });
  } catch (err) {
    console.log("CAUGHT ERROR /create-user : ", err.message);
    res.status(500).send("Internal Server Error");
  }
};

const getUserIcon = async (req, res) => {
  try {
    const { department_id } = req.params;
    const icon = await userIcon(department_id);
    res.send({ status: 200, icon });
  } catch (error) {
    res.send({ status: 500, message: "Something went wrong." });
  }
};

const changePassword = async (req, res) => {
  try {
    const { department_id } = req.params;
    const { old_password, new_password, confirm_password } = req.body;
    if (new_password !== confirm_password) {
      return res.send({ status: 403 });
    }
    if (new_password.length <= 7) {
      return res.send({
        status: 402,
        message: "Password must be greater than 7 letters",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~-]).+$/;

    if (!passwordRegex.test(new_password)) {
      return res.send({
        status: 401,
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one special character",
      });
    }

    const result = await updatePassword(
      department_id,
      old_password,
      new_password
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};
// Cb@12345
const verifyEmailController = async (req, res) => {
  const { email } = req.body;
  const result = await verifyEmail(email);
  if (result.status === 200) {
    const sendOTPResult = await sendOTP(email);
    res.send(sendOTPResult);
  } else {
    res.send(result);
  }
};
const verifyOTPController = async (req, res) => {
  try {
    const { verifyEmail, otp } = req.body;
    const result = await verifyOTP(verifyEmail, otp);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};
const changeEmailController = async (req, res) => {
  const { department_id } = req.params;
  const { current_password, confirm_current_password, new_email } = req.body;
  console.log(
    department_id,
    current_password,
    confirm_current_password,
    new_email
  );
  if (current_password !== confirm_current_password) {
    return res.send({ status: 403, message: "Password does not match" });
  }
  const result = await changeEmail(department_id, current_password, new_email);
  res.send(result);
};

const RequestorType = async (req, res) => {
  const result = await getRequestorType();
  res.send(result);
};

module.exports = {
  getUsers,
  getRoles,
  createNewUser,
  getUserIcon,
  changePassword,
  verifyEmailController,
  verifyOTPController,
  changeEmailController,
  RequestorType,
};
