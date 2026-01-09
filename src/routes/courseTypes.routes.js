const express = require('express')
const courseTypesController = require('../controllers/courseTypes.controller')

const router = express.Router()

router.post('/', courseTypesController.createCourseType)
router.get('/', courseTypesController.listCourseTypes)
router.patch('/:id', courseTypesController.updateCourseType)
router.delete('/:id', courseTypesController.deleteCourseType)

module.exports = router
