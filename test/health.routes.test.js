const request = require('supertest')
const { expect } = require('chai')
const sinon = require('sinon')
const db = require('../src/db/query')
const app = require('../src/app')

describe('health route', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('GET /health returns 200 when db is reachable', async () => {
    sinon.stub(db, 'execute').resolves([[]])

    const res = await request(app).get('/health')

    expect(res.status).to.equal(200)
    expect(res.body).to.deep.equal({ status: 'ok', db: 'ok' })
  })

  it('GET /health returns 503 when db is not reachable', async () => {
    sinon.stub(db, 'execute').rejects(new Error('db down'))

    const res = await request(app).get('/health')

    expect(res.status).to.equal(503)
    expect(res.body).to.deep.equal({ status: 'error', db: 'down' })
  })
})
