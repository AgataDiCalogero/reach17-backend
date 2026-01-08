const pool = require("./pool");

async function execute(sql, params = []) {
  return pool.execute(sql, params);
}

module.exports = {
  execute,
};
