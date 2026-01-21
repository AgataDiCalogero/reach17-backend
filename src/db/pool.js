require('dotenv').config()
const mysql = require('mysql2/promise')

function toNumber(value, fallback) {
  if (value == null || value === '') {
    return fallback
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const pool = mysql.createPool({
  host: process.env.TIDB_HOST,
  port: toNumber(process.env.TIDB_PORT, 4000),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {} : undefined,
  waitForConnections: true,
  connectionLimit: toNumber(process.env.TIDB_CONNECTION_LIMIT, 5),
  queueLimit: toNumber(process.env.TIDB_QUEUE_LIMIT, 0),
  connectTimeout: toNumber(process.env.TIDB_CONNECT_TIMEOUT, 10000),
})

module.exports = pool
