const { expect } = require('chai')
const sinon = require('sinon')
const AppError = require('../src/errors/AppError')
const universitiesService = require('../src/services/universities.service')
const universitiesRepository = require('../src/repositories/universities.repository')

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

describe('universities service', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('createUniversity validates missing name', async () => {
    await expectAppError(universitiesService.createUniversity({}), {
      status: 400,
      code: 'VALIDATION_ERROR',
    })
  })

  it('createUniversity maps duplicate error to 409', async () => {
    sinon
      .stub(universitiesRepository, 'create')
      .rejects({ code: 'ER_DUP_ENTRY' })

    await expectAppError(universitiesService.createUniversity({ name: 'X' }), {
      status: 409,
      code: 'DUPLICATE_RESOURCE',
    })
  })

  it('updateUniversity validates invalid id', async () => {
    await expectAppError(
      universitiesService.updateUniversity('abc', { name: 'X' }),
      {
        status: 400,
        code: 'VALIDATION_ERROR',
      },
    )
  })

  it('updateUniversity returns 404 when repo returns null', async () => {
    sinon.stub(universitiesRepository, 'updateById').resolves(null)

    await expectAppError(
      universitiesService.updateUniversity(1, { name: 'X' }),
      {
        status: 404,
        code: 'NOT_FOUND',
      },
    )
  })

  it('deleteUniversity returns 404 when repo returns false', async () => {
    sinon.stub(universitiesRepository, 'deleteById').resolves(false)

    await expectAppError(universitiesService.deleteUniversity(1), {
      status: 404,
      code: 'NOT_FOUND',
    })
  })

  it('deleteUniversity maps FK restrict to 409', async () => {
    sinon.stub(universitiesRepository, 'deleteById').rejects({ errno: 1451 })

    await expectAppError(universitiesService.deleteUniversity(1), {
      status: 409,
      code: 'CONFLICT',
    })
  })
})
