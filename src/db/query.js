const pool = require('./pool')

async function execute(sql, params = [], connection = null) {
  if (connection) {
    return connection.execute(sql, params)
  }
  return pool.execute(sql, params)
}

module.exports = {
  execute,
}
