const fs = require('node:fs')
const path = require('node:path')
const mysql = require('mysql2/promise')
require('dotenv').config()

async function run() {
  const fileArg = process.argv[2]
  if (!fileArg) {
    console.error('Usage: node scripts/db-run-sql.js <sql-file>')
    process.exit(1)
  }

  const sqlPath = path.resolve(process.cwd(), fileArg)
  if (!fs.existsSync(sqlPath)) {
    console.error(`File not found: ${sqlPath}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(sqlPath, 'utf8')
  const connection = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: Number(process.env.TIDB_PORT || 4000),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {} : undefined,
    multipleStatements: true,
  })

  try {
    await connection.query(sql)
    console.log(`Executed ${path.basename(sqlPath)}`)
  } finally {
    await connection.end()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
