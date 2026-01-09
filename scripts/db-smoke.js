const { execute } = require('../src/db/query')

async function run() {
  const [rows] = await execute('SELECT 1 AS ok')
  console.log(rows)
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
