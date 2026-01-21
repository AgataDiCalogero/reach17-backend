const pool = require('./pool')

async function withTransaction(work) {
  let connection
  try {
    connection = await pool.getConnection()
    await connection.beginTransaction()
    const result = await work(connection)
    await connection.commit()
    return result
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback()
      } catch {
        // Ignore rollback errors to surface the original failure.
      }
    }
    throw err
  } finally {
    if (connection) {
      connection.release()
    }
  }
}

module.exports = {
  withTransaction,
}
