const { expect } = require('chai')
const sinon = require('sinon')
const AppError = require('../src/errors/AppError')
const courseUniversitiesService = require('../src/services/courseUniversities.service')
const coursesRepository = require('../src/repositories/courses.repository')
const universitiesRepository = require('../src/repositories/universities.repository')
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

describe('course universities service', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('createAssociation returns association when entities exist', async () => {
    const association = { course_id: 1, university_id: 2 }
    sinon.stub(coursesRepository, 'findById').resolves({ id: 1 })
    sinon.stub(universitiesRepository, 'findById').resolves({ id: 2 })
    const createStub = sinon
      .stub(courseUniversitiesRepository, 'createAssociation')
      .resolves(association)

    const result = await courseUniversitiesService.createAssociation(1, 2)

    expect(result).to.deep.equal(association)
    expect(createStub.calledOnceWithExactly(1, 2)).to.equal(true)
  })

  it('createAssociation returns 404 when course is missing', async () => {
    sinon.stub(coursesRepository, 'findById').resolves(null)

    await expectAppError(courseUniversitiesService.createAssociation(1, 2), {
      status: 404,
      code: 'COURSE_NOT_FOUND',
    })
  })

  it('createAssociation returns 404 when university is missing', async () => {
    sinon.stub(coursesRepository, 'findById').resolves({ id: 1 })
    sinon.stub(universitiesRepository, 'findById').resolves(null)

    await expectAppError(courseUniversitiesService.createAssociation(1, 2), {
      status: 404,
      code: 'UNIVERSITY_NOT_FOUND',
    })
  })

  it('createAssociation maps duplicate error to 409', async () => {
    sinon.stub(coursesRepository, 'findById').resolves({ id: 1 })
    sinon.stub(universitiesRepository, 'findById').resolves({ id: 2 })
    sinon
      .stub(courseUniversitiesRepository, 'createAssociation')
      .rejects({ code: 'ER_DUP_ENTRY' })

    await expectAppError(courseUniversitiesService.createAssociation(1, 2), {
      status: 409,
      code: 'DUPLICATE_RESOURCE',
    })
  })

  it('deleteAssociation returns 404 when association is missing', async () => {
    sinon.stub(coursesRepository, 'findById').resolves({ id: 1 })
    sinon.stub(universitiesRepository, 'findById').resolves({ id: 2 })
    sinon
      .stub(courseUniversitiesRepository, 'deleteAssociation')
      .resolves(false)

    await expectAppError(courseUniversitiesService.deleteAssociation(1, 2), {
      status: 404,
      code: 'ASSOCIATION_NOT_FOUND',
    })
  })
})
