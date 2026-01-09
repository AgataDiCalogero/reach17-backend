const AppError = require('../errors/AppError')
const coursesRepository = require('../repositories/courses.repository')
const courseTypesRepository = require('../repositories/courseTypes.repository')
const courseUniversitiesRepository = require('../repositories/courseUniversities.repository')
const {
  isDuplicateError,
  isFkNotFoundError,
  isFkRestrictError,
} = require('../db/dbErrors')
const {
  toPositiveInt,
  normalizeName,
  requireAtLeastOneField,
} = require('../validators/common.validators')

function toCourseId(id) {
  return toPositiveInt(id, {
    fieldName: 'id',
    message: 'ID non valido',
  })
}

function toCourseTypeId(id, { required }) {
  return toPositiveInt(id, {
    fieldName: 'course_type_id',
    required,
    message: 'ID non valido',
  })
}

function normalizeCourseName(name, { required }) {
  return normalizeName(name, {
    required,
    fieldName: 'name',
    requiredMessage: 'Il nome è obbligatorio',
    invalidMessage: 'Nome non valido',
  })
}

function normalizeCourseTypeName(name) {
  return normalizeName(name, {
    required: false,
    fieldName: 'course_type',
    invalidMessage: 'Tipologia di corso non valida',
  })
}

async function ensureCourseTypeExists(courseTypeId) {
  const existing = await courseTypesRepository.findById(courseTypeId)
  if (!existing) {
    throw new AppError(
      404,
      'COURSE_TYPE_NOT_FOUND',
      'Tipologia di corso non trovata',
      [{ field: 'course_type_id', value: courseTypeId }],
    )
  }
}

function throwDuplicateCourse() {
  throw new AppError(409, 'DUPLICATE_RESOURCE', 'Corso già esistente', [
    { field: 'name' },
  ])
}

async function createCourse({ name, course_type_id }) {
  const normalizedName = normalizeCourseName(name, { required: true })
  const numericCourseTypeId = toCourseTypeId(course_type_id, { required: true })
  await ensureCourseTypeExists(numericCourseTypeId)

  try {
    return await coursesRepository.create({
      name: normalizedName,
      course_type_id: numericCourseTypeId,
    })
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateCourse()
    }
    if (isFkNotFoundError(err)) {
      await ensureCourseTypeExists(numericCourseTypeId)
    }
    throw err
  }
}

async function listCourses({ name, course_type, course_type_id } = {}) {
  const normalizedName = normalizeCourseName(name, { required: false })
  const numericCourseTypeId = toCourseTypeId(course_type_id, {
    required: false,
  })
  const normalizedCourseType =
    numericCourseTypeId != null ? null : normalizeCourseTypeName(course_type)

  const courses = await coursesRepository.findAllBase({
    name: normalizedName,
    course_type: normalizedCourseType,
    course_type_id: numericCourseTypeId,
  })

  const courseIds = courses.map((course) => course.id)
  const associations =
    await courseUniversitiesRepository.listUniversitiesByCourseIds(courseIds)
  const universitiesByCourseId = new Map()

  for (const association of associations) {
    if (!universitiesByCourseId.has(association.course_id)) {
      universitiesByCourseId.set(association.course_id, [])
    }
    universitiesByCourseId.get(association.course_id).push({
      id: association.university_id,
      name: association.university_name,
    })
  }

  return courses.map((course) => ({
    id: course.id,
    name: course.name,
    course_type: {
      id: course.course_type_id,
      name: course.course_type_name,
    },
    universities: universitiesByCourseId.get(course.id) || [],
  }))
}

async function updateCourse(id, { name, course_type_id }) {
  const numericId = toCourseId(id)
  const normalizedName = normalizeCourseName(name, { required: false })
  const numericCourseTypeId = toCourseTypeId(course_type_id, {
    required: false,
  })

  requireAtLeastOneField(
    { name: normalizedName, course_type_id: numericCourseTypeId },
    ['name', 'course_type_id'],
    { message: 'È necessario fornire almeno un campo' },
  )

  if (numericCourseTypeId != null) {
    await ensureCourseTypeExists(numericCourseTypeId)
  }

  try {
    const updated = await coursesRepository.updateById(numericId, {
      name: normalizedName,
      course_type_id: numericCourseTypeId,
    })
    if (!updated) {
      throw new AppError(404, 'COURSE_NOT_FOUND', 'Corso non trovato', [
        { field: 'id', value: numericId },
      ])
    }
    return updated
  } catch (err) {
    if (isDuplicateError(err)) {
      throwDuplicateCourse()
    }
    if (isFkNotFoundError(err)) {
      if (numericCourseTypeId != null) {
        await ensureCourseTypeExists(numericCourseTypeId)
      }
    }
    throw err
  }
}

async function deleteCourse(id) {
  const numericId = toCourseId(id)
  try {
    await courseUniversitiesRepository.deleteByCourseId(numericId)
    const deleted = await coursesRepository.deleteById(numericId)
    if (!deleted) {
      throw new AppError(404, 'COURSE_NOT_FOUND', 'Corso non trovato', [
        { field: 'id', value: numericId },
      ])
    }
  } catch (err) {
    if (isFkRestrictError(err)) {
      throw new AppError(409, 'CONFLICT', 'Corso in uso', [
        { field: 'id', value: numericId },
      ])
    }
    throw err
  }
  return true
}

module.exports = {
  createCourse,
  listCourses,
  updateCourse,
  deleteCourse,
}
