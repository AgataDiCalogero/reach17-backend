const coursesService = require('../services/courses.service')

async function createCourse(req, res) {
  const course = await coursesService.createCourse(req.body)
  res.status(201).json(course)
}

async function listCourses(req, res) {
  const courses = await coursesService.listCourses(req.query)
  res.status(200).json(courses)
}

async function updateCourse(req, res) {
  const course = await coursesService.updateCourse(req.params.id, req.body)
  res.status(200).json(course)
}

async function deleteCourse(req, res) {
  await coursesService.deleteCourse(req.params.id)
  res.status(204).end()
}

module.exports = {
  createCourse,
  listCourses,
  updateCourse,
  deleteCourse,
}
