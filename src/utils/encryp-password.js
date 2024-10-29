const bcrypt = require("bcrypt");
const saltRounds = 10;
module.exports = async (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);

  return hash;
};
