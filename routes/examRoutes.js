const express = require("express")
const router = express.Router()
// Get controllers
const { getExamData } = require('../controllers/examController')

router.get("/", getExamData)

// router.delete('/:id', deleteTest)

// router.put('/:id', updateTest)

module.exports = router