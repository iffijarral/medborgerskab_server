const express = require("express")
const router = express.Router()
// Get controllers
const { getPrevExams, getPrevExam, createPrevExam } = require('../controllers/prevExamController')

router.get("/", getPrevExams)

router.get("/:id/:season", getPrevExam)

router.post("/", createPrevExam)

// router.delete('/:id', deleteTest)

// router.put('/:id', updateTest)

module.exports = router