const courseTypesService = require('../services/courseTypes.service')

async function createCourseType(req, res) {
  const courseType = await courseTypesService.createCourseType(req.body)
  res.status(201).json(courseType)
}

async function listCourseTypes(req, res) {
  const courseTypes = await courseTypesService.listCourseTypes()
  res.status(200).json(courseTypes)
}

async function updateCourseType(req, res) {
  const courseType = await courseTypesService.updateCourseType(
    req.params.id,
    req.body,
  )
  res.status(200).json(courseType)
}

async function deleteCourseType(req, res) {
  await courseTypesService.deleteCourseType(req.params.id)
  res.status(204).end()
}

module.exports = {
  createCourseType,
  listCourseTypes,
  updateCourseType,
  deleteCourseType,
}
