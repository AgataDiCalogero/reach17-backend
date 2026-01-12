const AppError = require('../errors/AppError')
const courseTypesRepository = require('../repositories/courseTypes.repository')
const { isDuplicateError, isFkRestrictError } = require('../db/dbErrors')
const {
  toPositiveInt,
  normalizeName,
  requireAtLeastOneField,
} = require('../validators/common.validators')

function toCourseTypeId(id) {
  return toPositiveInt(id, {
    fieldName: 'id',
    message: 'ID non valido',
  })
}

function normalizeCourseTypeName(name, { required }) {
  return normalizeName(name, {
    required,
    fieldName: 'name',
    requiredMessage: "Il nome e' obbligatorio",
    invalidMessage: 'Nome non valido',
  })
}

function throwDuplicateName() {
  throw new AppError(
    409,
    'DUPLICATE_RESOURCE',
    "Tipologia di corso gia' esistente",
    [{ field: 'name' }],
  )
}

async function createCourseType({ name }) {
  const normalizedName = normalizeCourseTypeName(name, { required: true })
  try {
    return await courseTypesRepository.create(normalizedName)
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateName()
    }
    throw err
  }
}

async function listCourseTypes() {
  return courseTypesRepository.findAll()
}

async function updateCourseType(id, { name }) {
  const numericId = toCourseTypeId(id)
  const normalizedName = normalizeCourseTypeName(name, { required: false })
  requireAtLeastOneField({ name: normalizedName }, ['name'], {
    message: "E' necessario fornire almeno un campo",
  })

  try {
    const updated = await courseTypesRepository.updateById(
      numericId,
      normalizedName,
    )
    if (!updated) {
      throw new AppError(404, 'NOT_FOUND', 'Tipologia di corso non trovata', [
        { id: numericId },
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

async function deleteCourseType(id) {
  const numericId = toCourseTypeId(id)
  try {
    const deleted = await courseTypesRepository.deleteById(numericId)
    if (!deleted) {
      throw new AppError(404, 'NOT_FOUND', 'Tipologia di corso non trovata', [
        { id: numericId },
      ])
    }
  } catch (err) {
    if (isFkRestrictError(err)) {
      throw new AppError(409, 'CONFLICT', 'Tipologia di corso in uso', [
        { id: numericId },
      ])
    }
    throw err
  }
  return true
}

module.exports = {
  createCourseType,
  listCourseTypes,
  updateCourseType,
  deleteCourseType,
}
