const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
