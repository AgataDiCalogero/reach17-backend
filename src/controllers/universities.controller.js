const universitiesService = require('../services/universities.service')

async function createUniversity(req, res) {
  const university = await universitiesService.createUniversity(req.body)
  res.status(201).json(university)
}

async function listUniversities(req, res) {
  const universities = await universitiesService.listUniversities()
  res.status(200).json(universities)
}

async function updateUniversity(req, res) {
  const university = await universitiesService.updateUniversity(
    req.params.id,
    req.body,
  )
  res.status(200).json(university)
}

async function deleteUniversity(req, res) {
  await universitiesService.deleteUniversity(req.params.id)
  res.status(204).end()
}

module.exports = {
  createUniversity,
  listUniversities,
  updateUniversity,
  deleteUniversity,
}
