const { expect } = require('chai')
const request = require('supertest')

const shouldRun = process.env.RUN_INTEGRATION === 'true'
const describeIf = shouldRun ? describe : () => {}

describeIf('courses integration', () => {
  let app
  let courseTypeId = null
  let universityId = null
  let courseId = null

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
    if (courseId != null && universityId != null) {
      const deleteRes = await request(app).delete(
        `/api/v1/courses/${courseId}/universities/${universityId}`,
      )
      if (deleteRes.status !== 204 && deleteRes.status !== 404) {
        console.warn(
          `Cleanup warning: delete course-university association returned ${deleteRes.status}`,
        )
      }
    }
    if (courseId != null) {
      const deleteRes = await request(app).delete(`/api/v1/courses/${courseId}`)
      if (deleteRes.status !== 204 && deleteRes.status !== 404) {
        console.warn(
          `Cleanup warning: delete course returned ${deleteRes.status}`,
        )
      }
    }
    if (universityId != null) {
      const deleteRes = await request(app).delete(
        `/api/v1/universities/${universityId}`,
      )
      if (deleteRes.status !== 204 && deleteRes.status !== 404) {
        console.warn(
          `Cleanup warning: delete university returned ${deleteRes.status}`,
        )
      }
    }
    if (courseTypeId != null) {
      const deleteRes = await request(app).delete(
        `/api/v1/course-types/${courseTypeId}`,
      )
      if (deleteRes.status !== 204 && deleteRes.status !== 404) {
        console.warn(
          `Cleanup warning: delete course type returned ${deleteRes.status}`,
        )
      }
    }
    courseTypeId = null
    universityId = null
    courseId = null
  })

  it('creates course with association and returns universities in list', async function () {
    this.timeout(20000)
    const courseTypeName = `CT_${Date.now()}`
    const universityName = `UNI_${Date.now()}`
    const courseName = `COURSE_${Date.now()}`

    const courseTypeRes = await request(app)
      .post('/api/v1/course-types')
      .send({ name: courseTypeName })

    expect(courseTypeRes.status).to.equal(201)
    courseTypeId = courseTypeRes.body.id

    const universityRes = await request(app)
      .post('/api/v1/universities')
      .send({ name: universityName })

    expect(universityRes.status).to.equal(201)
    universityId = universityRes.body.id

    const courseRes = await request(app)
      .post('/api/v1/courses')
      .send({ name: courseName, course_type_id: courseTypeId })

    expect(courseRes.status).to.equal(201)
    courseId = courseRes.body.id

    const associationRes = await request(app).post(
      `/api/v1/courses/${courseId}/universities/${universityId}`,
    )

    expect(associationRes.status).to.equal(201)

    const listRes = await request(app).get('/api/v1/courses')

    expect(listRes.status).to.equal(200)
    const match = listRes.body.find(
      (item) => String(item.id) === String(courseId),
    )
    expect(match).to.include({ name: courseName })
    expect(match.course_type).to.deep.equal({
      id: courseTypeId,
      name: courseTypeName,
    })
    expect(match.universities).to.deep.equal([
      { id: universityId, name: universityName },
    ])
  })
})
