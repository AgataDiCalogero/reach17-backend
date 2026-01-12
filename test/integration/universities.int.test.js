const { expect } = require('chai')
const request = require('supertest')

const shouldRun = process.env.RUN_INTEGRATION === 'true'
const describeIf = shouldRun ? describe : () => {}

describeIf('universities integration', () => {
  let app
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
  })

  afterEach(async () => {
    if (createdId != null) {
      try {
        const deleteRes = await request(app).delete(
          `/api/v1/universities/${createdId}`,
        )
        if (deleteRes.status !== 204 && deleteRes.status !== 404) {
          console.warn(
            `Cleanup warning: delete university returned ${deleteRes.status}`,
          )
        }
      } finally {
        createdId = null
      }
    }
  })

  it('creates, lists, deletes universities', async function () {
    this.timeout(15000)
    const name = `UNI_${Date.now()}`

    const createRes = await request(app)
      .post('/api/v1/universities')
      .send({ name })

    expect(createRes.status).to.equal(201)
    expect(createRes.body).to.include({ name })
    expect(createRes.body).to.have.property('id')
    createdId = createRes.body.id

    const listRes = await request(app).get('/api/v1/universities')

    expect(listRes.status).to.equal(200)
    expect(listRes.body).to.be.an('array')
    const match = listRes.body.find(
      (item) => String(item.id) === String(createdId),
    )
    expect(match).to.include({ name })

    const deleteRes = await request(app).delete(
      `/api/v1/universities/${createdId}`,
    )

    expect(deleteRes.status).to.equal(204)
    createdId = null
  })
})
