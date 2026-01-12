const request = require('supertest')
const sinon = require('sinon')
const { expect } = require('chai')
const AppError = require('../src/errors/AppError')
const coursesService = require('../src/services/courses.service')
const courseUniversitiesService = require('../src/services/courseUniversities.service')
const app = require('../src/app')

describe('courses routes', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('happy path', () => {
    it('POST /api/v1/courses returns 201 and body', async () => {
      const now = '2024-01-01T10:00:00.000Z'
      const created = {
        id: 1,
        name: 'X',
        course_type_id: 2,
        created_at: now,
        updated_at: now,
      }
      sinon.stub(coursesService, 'createCourse').resolves(created)

      const res = await request(app)
        .post('/api/v1/courses')
        .send({ name: 'X', course_type_id: 2 })

      expect(res.status).to.equal(201)
      expect(res.body).to.deep.equal(created)
    })

    it('GET /api/v1/courses returns 200', async () => {
      const list = [
        {
          id: 1,
          name: 'A',
          course_type: { id: 2, name: 'Tipo' },
          universities: [{ id: 3, name: 'Uni' }],
        },
      ]
      sinon.stub(coursesService, 'listCourses').resolves(list)

      const res = await request(app).get('/api/v1/courses')

      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal(list)
    })

    it('PATCH /api/v1/courses/1 returns 200', async () => {
      const updated = {
        id: 1,
        name: 'Updated',
        course_type_id: 2,
        created_at: '2024-01-01T10:00:00.000Z',
        updated_at: '2024-01-02T10:00:00.000Z',
      }
      sinon.stub(coursesService, 'updateCourse').resolves(updated)

      const res = await request(app)
        .patch('/api/v1/courses/1')
        .send({ name: 'Updated' })

      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal(updated)
    })

    it('DELETE /api/v1/courses/1 returns 204 and empty body', async () => {
      sinon.stub(coursesService, 'deleteCourse').resolves(true)

      const res = await request(app).delete('/api/v1/courses/1')

      expect(res.status).to.equal(204)
      expect(res.text).to.equal('')
      expect(res.body).to.deep.equal({})
    })
  })

  describe('association routes', () => {
    it('POST /api/v1/courses/1/universities/2 returns 201', async () => {
      const association = { course_id: 1, university_id: 2 }
      sinon
        .stub(courseUniversitiesService, 'createAssociation')
        .resolves(association)

      const res = await request(app).post('/api/v1/courses/1/universities/2')

      expect(res.status).to.equal(201)
      expect(res.body).to.deep.equal(association)
    })

    it('DELETE /api/v1/courses/1/universities/2 returns 204', async () => {
      sinon.stub(courseUniversitiesService, 'deleteAssociation').resolves(true)

      const res = await request(app).delete('/api/v1/courses/1/universities/2')

      expect(res.status).to.equal(204)
      expect(res.text).to.equal('')
      expect(res.body).to.deep.equal({})
    })
  })

  describe('error path', () => {
    it('POST /api/v1/courses returns 400 AppError format', async () => {
      const error = new AppError(400, 'VALIDATION_ERROR', 'Nome non valido', [
        { field: 'name' },
      ])
      sinon.stub(coursesService, 'createCourse').rejects(error)

      const res = await request(app).post('/api/v1/courses').send({ name: '' })

      expect(res.status).to.equal(400)
      expect(res.body).to.deep.equal({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Nome non valido',
          details: [{ field: 'name' }],
        },
      })
    })

    it('PATCH /api/v1/courses/1 returns 404 AppError format', async () => {
      const error = new AppError(404, 'COURSE_NOT_FOUND', 'Corso non trovato', [
        { field: 'id', value: 1 },
      ])
      sinon.stub(coursesService, 'updateCourse').rejects(error)

      const res = await request(app)
        .patch('/api/v1/courses/1')
        .send({ name: 'Missing' })

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.equal({
        error: {
          code: 'COURSE_NOT_FOUND',
          message: 'Corso non trovato',
          details: [{ field: 'id', value: 1 }],
        },
      })
    })

    it('POST /api/v1/courses/1/universities/2 returns 404 AppError format', async () => {
      const error = new AppError(
        404,
        'UNIVERSITY_NOT_FOUND',
        'Ateneo non trovato',
        [{ field: 'university_id', value: 2 }],
      )
      sinon.stub(courseUniversitiesService, 'createAssociation').rejects(error)

      const res = await request(app).post('/api/v1/courses/1/universities/2')

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.equal({
        error: {
          code: 'UNIVERSITY_NOT_FOUND',
          message: 'Ateneo non trovato',
          details: [{ field: 'university_id', value: 2 }],
        },
      })
    })

    it('DELETE /api/v1/courses/1/universities/2 returns 404 AppError format', async () => {
      const error = new AppError(
        404,
        'ASSOCIATION_NOT_FOUND',
        'Associazione non trovata',
        [
          { field: 'course_id', value: 1 },
          { field: 'university_id', value: 2 },
        ],
      )
      sinon.stub(courseUniversitiesService, 'deleteAssociation').rejects(error)

      const res = await request(app).delete('/api/v1/courses/1/universities/2')

      expect(res.status).to.equal(404)
      expect(res.body).to.deep.equal({
        error: {
          code: 'ASSOCIATION_NOT_FOUND',
          message: 'Associazione non trovata',
          details: [
            { field: 'course_id', value: 1 },
            { field: 'university_id', value: 2 },
          ],
        },
      })
    })
  })
})
