/* eslint-env mocha */
const { expect } = require('chai')
const request = require('supertest')

const shouldRun = process.env.RUN_INTEGRATION === 'true'
const describeIf = shouldRun ? describe : () => {}

describeIf('course types integration', () => {
  let app
  let pool
  let createdId = null

  before(() => {
    const required = [
      'TIDB_HOST',
      'TIDB_USER',
      'TIDB_PASSWORD',
      'TIDB_DATABASE',
    ]
    const missing = required.filter((key) => !process.env[key])
    if (missing.length > 0) {
      throw new Error(
        `Mancano le variabili d'ambiente richieste per i test di integrazione: ${missing.join(
          ', ',
        )}`,
      )
    }
    app = require('../../src/app')
    pool = require('../../src/db/pool')
  })

  afterEach(async () => {
    if (createdId != null) {
      try {
        await request(app).delete(`/api/v1/course-types/${createdId}`)
      } finally {
        createdId = null
      }
    }
  })

  after(async () => {
    if (pool && typeof pool.end === 'function') {
      await pool.end()
    }
  })

  it('creates, lists, deletes course types', async function () {
    this.timeout(15000)
    const name = `CT_${Date.now()}`

    const createRes = await request(app)
      .post('/api/v1/course-types')
      .send({ name })

    expect(createRes.status).to.equal(201)
    expect(createRes.body).to.include({ name })
    expect(createRes.body).to.have.property('id')
    createdId = createRes.body.id

    const listRes = await request(app).get('/api/v1/course-types')

    expect(listRes.status).to.equal(200)
    expect(listRes.body).to.be.an('array')
    const match = listRes.body.find(
      (item) => String(item.id) === String(createdId),
    )
    expect(match).to.include({ name })

    const deleteRes = await request(app).delete(
      `/api/v1/course-types/${createdId}`,
    )

    expect(deleteRes.status).to.equal(204)
    createdId = null
  })
})
