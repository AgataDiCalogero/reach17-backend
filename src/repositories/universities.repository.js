const { execute } = require('../db/query')

async function findById(id) {
  const selectSql =
    'SELECT id, name, created_at, updated_at FROM universities WHERE id = ?'
  const [rows] = await execute(selectSql, [id])
  return rows[0] || null
}

async function create(name) {
  const insertSql = 'INSERT INTO universities (name) VALUES (?)'
  const [result] = await execute(insertSql, [name])
  return findById(result.insertId)
}

async function findAll() {
  const selectSql =
    'SELECT id, name, created_at, updated_at FROM universities ORDER BY id ASC'
  const [rows] = await execute(selectSql)
  return rows
}

async function updateById(id, name) {
  const updateSql = 'UPDATE universities SET name = ? WHERE id = ?'
  const [result] = await execute(updateSql, [name, id])
  if (result.affectedRows === 0) {
    return null
  }
  return findById(id)
}

async function deleteById(id) {
  const deleteSql = 'DELETE FROM universities WHERE id = ?'
  const [result] = await execute(deleteSql, [id])
  return result.affectedRows > 0
}

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
}
