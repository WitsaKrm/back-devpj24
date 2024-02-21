const md5 = require("md5");
// Custom middleware
const hashmd5 = (data) => {
  gen_hash = md5(data);
  return gen_hash;
};

const authenticate = () => {};

module.exports = { hashmd5, authenticate };
