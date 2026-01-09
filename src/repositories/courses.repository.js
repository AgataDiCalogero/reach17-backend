const { execute } = require('../db/query')

async function findById(id) {
  const selectSql =
    'SELECT id, name, course_type_id, created_at, updated_at FROM courses WHERE id = ?'
  const [rows] = await execute(selectSql, [id])
  return rows[0] || null
}

async function create({ name, course_type_id }) {
  const insertSql = 'INSERT INTO courses (name, course_type_id) VALUES (?, ?)'
  const [result] = await execute(insertSql, [name, course_type_id])
  return findById(result.insertId)
}

async function findAllBase({ name, course_type, course_type_id } = {}) {
  let selectSql = `
    SELECT
      c.id,
      c.name,
      ct.id AS course_type_id,
      ct.name AS course_type_name
    FROM courses c
    JOIN course_types ct ON ct.id = c.course_type_id
  `
  const params = []
  const conditions = []

  if (name != null && name !== '') {
    conditions.push('c.name LIKE ?')
    params.push(`%${name}%`)
  }

  if (course_type_id != null) {
    conditions.push('c.course_type_id = ?')
    params.push(course_type_id)
  }

  if (course_type != null && course_type !== '') {
    conditions.push('ct.name = ?')
    params.push(course_type)
  }

  if (conditions.length > 0) {
    selectSql += ` WHERE ${conditions.join(' AND ')}`
  }

  selectSql += ' ORDER BY c.id ASC'

  const [rows] = await execute(selectSql, params)
  return rows
}

async function updateById(id, { name, course_type_id }) {
  const setClauses = []
  const params = []

  if (name != null) {
    setClauses.push('name = ?')
    params.push(name)
  }

  if (course_type_id != null) {
    setClauses.push('course_type_id = ?')
    params.push(course_type_id)
  }

  if (setClauses.length === 0) {
    return null
  }

  const updateSql = `UPDATE courses SET ${setClauses.join(', ')} WHERE id = ?`
  const [result] = await execute(updateSql, [...params, id])
  if (result.affectedRows === 0) {
    return null
  }
  return findById(id)
}

async function deleteById(id) {
  const deleteSql = 'DELETE FROM courses WHERE id = ?'
  const [result] = await execute(deleteSql, [id])
  return result.affectedRows > 0
}

module.exports = {
  create,
  findAllBase,
  findById,
  updateById,
  deleteById,
}
