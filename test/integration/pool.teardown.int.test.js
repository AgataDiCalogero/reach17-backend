const shouldRun = process.env.RUN_INTEGRATION === 'true'

if (shouldRun) {
  const pool = require('../../src/db/pool')

  after(async () => {
    if (pool && typeof pool.end === 'function') {
      await pool.end()
    }
  })
}
