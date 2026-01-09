const express = require('express')
const universitiesController = require('../controllers/universities.controller')

const router = express.Router()

router.post('/', universitiesController.createUniversity)
router.get('/', universitiesController.listUniversities)
router.patch('/:id', universitiesController.updateUniversity)
router.delete('/:id', universitiesController.deleteUniversity)

module.exports = router
