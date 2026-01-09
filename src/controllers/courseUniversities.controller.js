const courseUniversitiesService = require('../services/courseUniversities.service')

async function createAssociation(req, res) {
  const association = await courseUniversitiesService.createAssociation(
    req.params.courseId,
    req.params.universityId,
  )
  res.status(201).json(association)
}

async function deleteAssociation(req, res) {
  await courseUniversitiesService.deleteAssociation(
    req.params.courseId,
    req.params.universityId,
  )
  res.status(204).end()
}

module.exports = {
  createAssociation,
  deleteAssociation,
}
