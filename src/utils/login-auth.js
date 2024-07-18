const findUserByDeptId = require("../controllers/authenticate-user");
const loginAuth = async (user_credential) => {
  try {
    const response = await findUserByDeptId(user_credential);

    if (response.status === 404 || response.status === 401) {
      return response;
    }
    return response;
  } catch (err) {
    return { status: 500, message: "Internal Server Error" };
  }
};

module.exports = loginAuth;
