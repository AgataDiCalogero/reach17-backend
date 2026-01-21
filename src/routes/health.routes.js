const express = require('express')
const db = require('../db/query')

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    await db.execute('SELECT 1')
    res.status(200).json({ status: 'ok', db: 'ok' })
  } catch {
    res.status(503).json({ status: 'error', db: 'down' })
  }
})

module.exports = router
