const { expect } = require('chai')
const sinon = require('sinon')
const AppError = require('../src/errors/AppError')
const coursesService = require('../src/services/courses.service')
const coursesRepository = require('../src/repositories/courses.repository')
const courseTypesRepository = require('../src/repositories/courseTypes.repository')
const courseUniversitiesRepository = require('../src/repositories/courseUniversities.repository')

async function expectAppError(promise, { status, code }) {
  try {
    await promise
    throw new Error('Expected AppError')
  } catch (err) {
    if (err.message === 'Expected AppError') {
      throw err
    }
    expect(err).to.be.instanceOf(AppError)
    expect(err.status).to.equal(status)
    expect(err.code).to.equal(code)
    return err
  }
}

describe('courses service', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('createCourse validates missing name', async () => {
    await expectAppError(coursesService.createCourse({ course_type_id: 1 }), {
      status: 400,
      code: 'VALIDATION_ERROR',
    })
  })

  it('createCourse maps duplicate error to 409', async () => {
    sinon.stub(courseTypesRepository, 'findById').resolves({ id: 1 })
    sinon.stub(coursesRepository, 'create').rejects({ code: 'ER_DUP_ENTRY' })

    await expectAppError(
      coursesService.createCourse({ name: 'X', course_type_id: 1 }),
      {
        status: 409,
        code: 'DUPLICATE_RESOURCE',
      },
    )
  })

  it('updateCourse validates invalid id', async () => {
    await expectAppError(coursesService.updateCourse('abc', { name: 'X' }), {
      status: 400,
      code: 'VALIDATION_ERROR',
    })
  })

  it('updateCourse returns 404 when repo returns null', async () => {
    sinon.stub(coursesRepository, 'updateById').resolves(null)

    await expectAppError(coursesService.updateCourse(1, { name: 'X' }), {
      status: 404,
      code: 'COURSE_NOT_FOUND',
    })
  })

  it('deleteCourse returns 404 when repo returns false', async () => {
    sinon.stub(courseUniversitiesRepository, 'deleteByCourseId').resolves(true)
    sinon.stub(coursesRepository, 'deleteById').resolves(false)

    await expectAppError(coursesService.deleteCourse(1), {
      status: 404,
      code: 'COURSE_NOT_FOUND',
    })
  })

  it('deleteCourse maps FK restrict to 409', async () => {
    sinon.stub(courseUniversitiesRepository, 'deleteByCourseId').resolves(true)
    sinon.stub(coursesRepository, 'deleteById').rejects({ errno: 1451 })

    await expectAppError(coursesService.deleteCourse(1), {
      status: 409,
      code: 'CONFLICT',
    })
  })
})
