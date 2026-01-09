/* eslint-env mocha */
const request = require('supertest')
const sinon = require('sinon')
const { expect } = require('chai')
const AppError = require('../src/errors/AppError')
const courseTypesService = require('../src/services/courseTypes.service')
const app = require('../src/app')

describe('course types routes', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('happy path', () => {
    it('POST /api/v1/course-types returns 201 and body', async () => {
      const now = '2024-01-01T10:00:00.000Z'
      const created = { id: 1, name: 'X', created_at: now, updated_at: now }
      sinon.stub(courseTypesService, 'createCourseType').resolves(created)

      const res = await request(app)
        .post('/api/v1/course-types')
        .send({ name: 'X' })

      expect(res.status).to.equal(201)
      expect(res.body).to.deep.equal(created)
    })

    it('GET /api/v1/course-types returns 200', async () => {
      const list = [
        {
          id: 1,
          name: 'A',
          created_at: '2024-01-01T10:00:00.000Z',
          updated_at: '2024-01-01T10:00:00.000Z',
        },
      ]
      sinon.stub(courseTypesService, 'listCourseTypes').resolves(list)

      const res = await request(app).get('/api/v1/course-types')

      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal(list)
    })

    it('PATCH /api/v1/course-types/1 returns 200', async () => {
      const updated = {
        id: 1,
        name: 'Updated',
        created_at: '2024-01-01T10:00:00.000Z',
        updated_at: '2024-01-02T10:00:00.000Z',
      }
      sinon.stub(courseTypesService, 'updateCourseType').resolves(updated)

      const res = await request(app)
        .patch('/api/v1/course-types/1')
        .send({ name: 'Updated' })

      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal(updated)
    })

    it('DELETE /api/v1/course-types/1 returns 204 and empty body', async () => {
      sinon.stub(courseTypesService, 'deleteCourseType').resolves(true)

      const res = await request(app).delete('/api/v1/course-types/1')

      expect(res.status).to.equal(204)
      expect(res.text).to.equal('')
    })
  })

  describe('error path', () => {
    it('POST /api/v1/course-types returns 400 AppError format', async () => {
      const error = new AppError(400, 'VALIDATION_ERROR', 'Invalid payload', [
        { field: 'name' },
      ])
      sinon.stub(courseTypesService, 'createCourseType').rejects(error)

      const res = await request(app)
        .post('/api/v1/course-types')
        .send({ name: '' })

      expect(res.status).to.equal(400)
      expect(res.body).to.deep.equal({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid payload',
          details: [{ field: 'name' }],
        },
      })
    })

    it('POST /api/v1/course-types returns 409 duplicate format', async () => {
      const error = new AppError(
        409,
        'DUPLICATE_RESOURCE',
        'Course type name already exists',
        [{ field: 'name' }],
      )
      sinon.stub(courseTypesService, 'createCourseType').rejects(error)

      const res = await request(app)
        .post('/api/v1/course-types')
        .send({ name: 'X' })

      expect(res.status).to.equal(409)
      expect(res.body).to.deep.equal({
        error: {
          code: 'DUPLICATE_RESOURCE',
          message: 'Course type name already exists',
          details: [{ field: 'name' }],
        },
      })
    })

    it('PATCH /api/v1/course-types/1 returns 404 AppError format', async () => {
      const error = new AppError(404, 'NOT_FOUND', 'Course type not found', [
        { id: 1 },
      ])
      sinon.stub(courseTypesService, 'updateCourseType').rejects(error)

      const res = await request(app)
        .patch('/api/v1/course-types/1')
        .send({ name: 'Missing' })

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.equal({
        error: {
          code: 'NOT_FOUND',
          message: 'Course type not found',
          details: [{ id: 1 }],
        },
      })
    })

    it('GET /api/v1/unknown returns 404 NOT_FOUND with method/path details', async () => {
      const res = await request(app).get('/api/v1/unknown')

      expect(res.status).to.equal(404)
      expect(res.body.error.code).to.equal('NOT_FOUND')
      expect(res.body.error.details).to.deep.equal([
        { path: '/api/v1/unknown', method: 'GET' },
      ])
    })
  })
})
