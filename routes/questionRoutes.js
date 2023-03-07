const express = require("express")
const router = express.Router()
// Get controllers
const { getQuestions, getQuestion, createQuestion,createBulkQuestions, updateQuestion, deleteQuestion } = require('../controllers/questionController')

router.get("/", getQuestions)

router.get("/:id", getQuestion)

router.post("/", createQuestion)

router.post("/bulkQuestions", createBulkQuestions)

router.put('/:id', updateQuestion)

router.delete('/:id', deleteQuestion)

module.exports = router