const { execute } = require('../db/query')

async function createAssociation(courseId, universityId) {
  const insertSql =
    'INSERT INTO course_universities (course_id, university_id) VALUES (?, ?)'
  await execute(insertSql, [courseId, universityId])
  return { course_id: courseId, university_id: universityId }
}

async function deleteAssociation(courseId, universityId) {
  const deleteSql =
    'DELETE FROM course_universities WHERE course_id = ? AND university_id = ?'
  const [result] = await execute(deleteSql, [courseId, universityId])
  return result.affectedRows > 0
}

async function deleteByCourseId(courseId) {
  const deleteSql = 'DELETE FROM course_universities WHERE course_id = ?'
  const [result] = await execute(deleteSql, [courseId])
  return result.affectedRows > 0
}

async function listUniversitiesByCourseIds(courseIds) {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return []
  }

  const placeholders = courseIds.map(() => '?').join(', ')
  const selectSql = `
    SELECT
      cu.course_id,
      u.id AS university_id,
      u.name AS university_name
    FROM course_universities cu
    JOIN universities u ON u.id = cu.university_id
    WHERE cu.course_id IN (${placeholders})
    ORDER BY cu.course_id ASC, u.id ASC
  `
  const [rows] = await execute(selectSql, courseIds)
  return rows
}

module.exports = {
  createAssociation,
  deleteAssociation,
  deleteByCourseId,
  listUniversitiesByCourseIds,
}
