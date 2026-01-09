const AppError = require('../errors/AppError')
const coursesRepository = require('../repositories/courses.repository')
const universitiesRepository = require('../repositories/universities.repository')
const courseUniversitiesRepository = require('../repositories/courseUniversities.repository')
const { isDuplicateError } = require('../db/dbErrors')
const { toPositiveInt } = require('../validators/common.validators')

function toCourseId(id) {
  return toPositiveInt(id, {
    fieldName: 'course_id',
    message: 'ID non valido',
  })
}

function toUniversityId(id) {
  return toPositiveInt(id, {
    fieldName: 'university_id',
    message: 'ID non valido',
  })
}

async function ensureCourseExists(courseId) {
  const existing = await coursesRepository.findById(courseId)
  if (!existing) {
    throw new AppError(404, 'COURSE_NOT_FOUND', 'Corso non trovato', [
      { field: 'course_id', value: courseId },
    ])
  }
}

async function ensureUniversityExists(universityId) {
  const existing = await universitiesRepository.findById(universityId)
  if (!existing) {
    throw new AppError(404, 'UNIVERSITY_NOT_FOUND', 'Ateneo non trovato', [
      { field: 'university_id', value: universityId },
    ])
  }
}

function throwDuplicateAssociation(courseId, universityId) {
  throw new AppError(409, 'DUPLICATE_RESOURCE', 'Associazione già esistente', [
    { field: 'course_id', value: courseId },
    { field: 'university_id', value: universityId },
  ])
}

async function createAssociation(courseId, universityId) {
  const numericCourseId = toCourseId(courseId)
  const numericUniversityId = toUniversityId(universityId)

  await ensureCourseExists(numericCourseId)
  await ensureUniversityExists(numericUniversityId)

  try {
    return await courseUniversitiesRepository.createAssociation(
      numericCourseId,
      numericUniversityId,
    )
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateAssociation(numericCourseId, numericUniversityId)
    }
    throw err
  }
}

async function deleteAssociation(courseId, universityId) {
  const numericCourseId = toCourseId(courseId)
  const numericUniversityId = toUniversityId(universityId)

  await ensureCourseExists(numericCourseId)
  await ensureUniversityExists(numericUniversityId)

  const deleted = await courseUniversitiesRepository.deleteAssociation(
    numericCourseId,
    numericUniversityId,
  )
  if (!deleted) {
    throw new AppError(
      404,
      'ASSOCIATION_NOT_FOUND',
      'Associazione non trovata',
      [
        { field: 'course_id', value: numericCourseId },
        { field: 'university_id', value: numericUniversityId },
      ],
    )
  }
  return true
}

module.exports = {
  createAssociation,
  deleteAssociation,
}
