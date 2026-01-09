const AppError = require('../errors/AppError')
const courseTypesRepository = require('../repositories/courseTypes.repository')

function toPositiveInt(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'ID non valido', [{ id }])
  }
  return numericId
}

function normalizeName(name, { required }) {
  if (name == null) {
    if (required) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Il nome e obbligatorio', [
        { field: 'name' },
      ])
    }
    return null
  }

  if (typeof name !== 'string') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Nome non valido', [
      { field: 'name' },
    ])
  }

  const trimmed = name.trim()
  if (!trimmed) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Nome non valido', [
      { field: 'name' },
    ])
  }

  return trimmed
}

function isDuplicateError(err) {
  return err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)
}

function isFkRestrictError(err) {
  return err && (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451)
}

function throwDuplicateName() {
  throw new AppError(
    409,
    'DUPLICATE_RESOURCE',
    'Tipologia di corso gia esistente',
    [{ field: 'name' }],
  )
}

async function createCourseType({ name }) {
  const normalizedName = normalizeName(name, { required: true })
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
  const numericId = toPositiveInt(id)
  const normalizedName = normalizeName(name, { required: false })
  if (normalizedName == null) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'E necessario fornire almeno un campo',
      [{ field: 'name' }],
    )
  }

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
  const numericId = toPositiveInt(id)
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
