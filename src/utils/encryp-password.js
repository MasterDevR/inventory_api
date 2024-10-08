const bcrypt = require("bcrypt");
const saltRounds = 10;
const encrypPassword = async (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);

  return hash;
};

module.exports = encrypPassword;
