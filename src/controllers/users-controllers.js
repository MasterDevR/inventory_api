const getAllUser = require("../service/get-all-user");
const uploadImage = require("../utils/upload-image");
const userRole = require("../service/get-user-role");
const createUser = require("../service/create-user");
const findUser = require("../service/find-user");

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
      await createUser({ ...userData, imageSrc });
      res.send({ status: 200, message: "User created successfully" });
    }

    console.log(isExisting);
    res.send({
      status: 403,
      message: "Creation Failed. User Is Already Existing.",
    });
  } catch (err) {
    console.log("CAUGHT ERROR /create-user : ", err.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = { getUsers, getRoles, createNewUser };
