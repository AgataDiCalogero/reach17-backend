const request = require('supertest')
const { expect } = require('chai')
const app = require('../src/app')

describe('root route', () => {
  it('GET / returns 200 and info payload', async () => {
    const res = await request(app).get('/')

    expect(res.status).to.equal(200)
    expect(res.body).to.have.property('name')
    expect(res.body).to.have.property('docs')
    expect(res.body).to.have.property('openapi')
  })
})
