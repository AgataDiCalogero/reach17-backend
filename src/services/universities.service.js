const AppError = require('../errors/AppError')
const universitiesRepository = require('../repositories/universities.repository')
const { isDuplicateError, isFkRestrictError } = require('../db/dbErrors')
const {
  toPositiveInt,
  normalizeName,
  requireAtLeastOneField,
} = require('../validators/common.validators')

function toUniversityId(id) {
  return toPositiveInt(id, {
    fieldName: 'id',
    message: 'ID non valido',
  })
}

function normalizeUniversityName(name, { required }) {
  return normalizeName(name, {
    required,
    fieldName: 'name',
    requiredMessage: "Il nome e' obbligatorio",
    invalidMessage: 'Nome non valido',
  })
}

function throwDuplicateName() {
  throw new AppError(409, 'DUPLICATE_RESOURCE', "Ateneo gia' esistente", [
    { field: 'name' },
  ])
}

async function createUniversity({ name }) {
  const normalizedName = normalizeUniversityName(name, { required: true })
  try {
    return await universitiesRepository.create(normalizedName)
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateName()
    }
    throw err
  }
}

async function listUniversities() {
  return universitiesRepository.findAll()
}

async function updateUniversity(id, { name }) {
  const numericId = toUniversityId(id)
  const normalizedName = normalizeUniversityName(name, { required: false })
  requireAtLeastOneField({ name: normalizedName }, ['name'], {
    message: "E' necessario fornire almeno un campo",
  })

  try {
    const updated = await universitiesRepository.updateById(
      numericId,
      normalizedName,
    )
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Ateneo non trovato', [
        { field: 'id', value: numericId },
      ])
    }
    return updated
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateName()
    }
    throw err
  }
}

async function deleteUniversity(id) {
  const numericId = toUniversityId(id)
  try {
    const deleted = await universitiesRepository.deleteById(numericId)
    if (!deleted) {
      throw new AppError(404, 'NOT_FOUND', 'Ateneo non trovato', [
        { field: 'id', value: numericId },
      ])
    }
  } catch (err) {
    if (isFkRestrictError(err)) {
      throw new AppError(409, 'CONFLICT', 'Ateneo in uso', [
        { field: 'id', value: numericId },
      ])
    }
    throw err
  }
  return true
}

module.exports = {
  createUniversity,
  listUniversities,
  updateUniversity,
  deleteUniversity,
}
