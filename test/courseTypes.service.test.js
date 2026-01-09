const { expect } = require('chai')
const sinon = require('sinon')
const AppError = require('../src/errors/AppError')
const courseTypesService = require('../src/services/courseTypes.service')
const courseTypesRepository = require('../src/repositories/courseTypes.repository')

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

describe('course types service', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('createCourseType validates missing name', async () => {
    await expectAppError(courseTypesService.createCourseType({}), {
      status: 400,
      code: 'VALIDATION_ERROR',
    })
  })

  it('createCourseType returns created record and trims name', async () => {
    const created = { id: 1, name: 'Frontend' }
    const createStub = sinon
      .stub(courseTypesRepository, 'create')
      .resolves(created)

    const result = await courseTypesService.createCourseType({
      name: '  Frontend  ',
    })

    expect(result).to.equal(created)
    expect(createStub.calledOnceWithExactly('Frontend')).to.equal(true)
  })

  it('createCourseType maps duplicate error to 409', async () => {
    sinon
      .stub(courseTypesRepository, 'create')
      .rejects({ code: 'ER_DUP_ENTRY' })

    await expectAppError(courseTypesService.createCourseType({ name: 'X' }), {
      status: 409,
      code: 'DUPLICATE_RESOURCE',
    })
  })

  it('updateCourseType validates invalid id', async () => {
    await expectAppError(
      courseTypesService.updateCourseType('abc', { name: 'X' }),
      {
        status: 400,
        code: 'VALIDATION_ERROR',
      },
    )
  })

  it('updateCourseType returns 404 when repo returns null', async () => {
    const updateStub = sinon
      .stub(courseTypesRepository, 'updateById')
      .resolves(null)

    await expectAppError(
      courseTypesService.updateCourseType('1', { name: ' X ' }),
      {
        status: 404,
        code: 'NOT_FOUND',
      },
    )
    expect(updateStub.calledOnceWithExactly(1, 'X')).to.equal(true)
  })

  it('listCourseTypes returns list from repository', async () => {
    const list = [
      {
        id: 1,
        name: 'Backend',
        created_at: '2024-01-01T10:00:00.000Z',
        updated_at: '2024-01-01T10:00:00.000Z',
      },
    ]
    const findAllStub = sinon
      .stub(courseTypesRepository, 'findAll')
      .resolves(list)

    const result = await courseTypesService.listCourseTypes()

    expect(result).to.equal(list)
    expect(findAllStub.calledOnce).to.equal(true)
  })

  it('deleteCourseType returns 404 when repo returns false', async () => {
    const deleteStub = sinon
      .stub(courseTypesRepository, 'deleteById')
      .resolves(false)

    await expectAppError(courseTypesService.deleteCourseType('2'), {
      status: 404,
      code: 'NOT_FOUND',
    })
    expect(deleteStub.calledOnceWithExactly(2)).to.equal(true)
  })

  it('deleteCourseType maps FK restrict to 409', async () => {
    sinon.stub(courseTypesRepository, 'deleteById').rejects({ errno: 1451 })

    await expectAppError(courseTypesService.deleteCourseType(1), {
      status: 409,
      code: 'CONFLICT',
    })
  })
})
