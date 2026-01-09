const express = require('express')
const coursesController = require('../controllers/courses.controller')
const courseUniversitiesController = require('../controllers/courseUniversities.controller')

const router = express.Router()

router.post('/', coursesController.createCourse)
router.get('/', coursesController.listCourses)
router.patch('/:id', coursesController.updateCourse)
router.delete('/:id', coursesController.deleteCourse)
router.post(
  '/:courseId/universities/:universityId',
  courseUniversitiesController.createAssociation,
)
router.delete(
  '/:courseId/universities/:universityId',
  courseUniversitiesController.deleteAssociation,
)

module.exports = router
