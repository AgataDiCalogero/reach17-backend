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

  it('listCourses forwards name filter and groups universities', async () => {
    const baseRows = [
      {
        id: 1,
        name: 'Data Science',
        course_type_id: 2,
        course_type_name: 'Master',
      },
      {
        id: 2,
        name: 'Economia',
        course_type_id: 3,
        course_type_name: 'Laurea Magistrale',
      },
    ]
    const findAllStub = sinon
      .stub(coursesRepository, 'findAllBase')
      .resolves(baseRows)
    const associationsStub = sinon
      .stub(courseUniversitiesRepository, 'listUniversitiesByCourseIds')
      .resolves([
        {
          course_id: 1,
          university_id: 10,
          university_name: 'Uni A',
        },
        {
          course_id: 1,
          university_id: 11,
          university_name: 'Uni B',
        },
        {
          course_id: 2,
          university_id: 12,
          university_name: 'Uni C',
        },
      ])

    const result = await coursesService.listCourses({ name: '  Data  ' })

    expect(
      findAllStub.calledOnceWithExactly({
        name: 'Data',
        course_type: null,
        course_type_id: null,
      }),
    ).to.equal(true)
    expect(associationsStub.calledOnceWithExactly([1, 2])).to.equal(true)
    expect(result).to.deep.equal([
      {
        id: 1,
        name: 'Data Science',
        course_type: { id: 2, name: 'Master' },
        universities: [
          { id: 10, name: 'Uni A' },
          { id: 11, name: 'Uni B' },
        ],
      },
      {
        id: 2,
        name: 'Economia',
        course_type: { id: 3, name: 'Laurea Magistrale' },
        universities: [{ id: 12, name: 'Uni C' }],
      },
    ])
  })

  it('listCourses forwards course_type filter', async () => {
    const findAllStub = sinon
      .stub(coursesRepository, 'findAllBase')
      .resolves([])
    const associationsStub = sinon
      .stub(courseUniversitiesRepository, 'listUniversitiesByCourseIds')
      .resolves([])

    const result = await coursesService.listCourses({ course_type: ' Master ' })

    expect(
      findAllStub.calledOnceWithExactly({
        name: null,
        course_type: 'Master',
        course_type_id: null,
      }),
    ).to.equal(true)
    expect(associationsStub.calledOnceWithExactly([])).to.equal(true)
    expect(result).to.deep.equal([])
  })

  it('listCourses forwards name and course_type filters together', async () => {
    const findAllStub = sinon
      .stub(coursesRepository, 'findAllBase')
      .resolves([])
    sinon
      .stub(courseUniversitiesRepository, 'listUniversitiesByCourseIds')
      .resolves([])

    await coursesService.listCourses({
      name: 'Eco',
      course_type: 'Laurea Magistrale',
    })

    expect(
      findAllStub.calledOnceWithExactly({
        name: 'Eco',
        course_type: 'Laurea Magistrale',
        course_type_id: null,
      }),
    ).to.equal(true)
  })
})
