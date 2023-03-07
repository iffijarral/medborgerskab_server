const asyncHandler = require("express-async-handler")
const Question = require("../models").Question
const Test = require("../models").Test


// @des     Get Questions
// @route   GET /api/Questions
// @access  Private 
const getQuestions = asyncHandler(async (req, res) => {

    const questions = await Question.findAll() // Fetching all Questions    

    if (questions) {
        res.status(200).json(questions)
    }
    else {
        res.status(400)
        throw new Error('No question available')
    }


})

// @des     Get single question
// @route   GET /api/question/id
// @access  Private 
const getQuestion = asyncHandler(async (req, res) => {
    const id = req.params.id
    const question = await Question.findAll({
        where: { id },
        attributes: ["op1", "op2", "op3", "answer"],
        include: [{
            model: Test,
            attributes: ["title"],
        }]
    })

    if (question) {
        res.status(200).json(question)
    }
    else {
        res.status(400)
        throw new Error('Invalid Question ID')
    }
})

// @des     Create a question
// @route   POST /api/questions
// @access  Private 
const createQuestion = asyncHandler(async (req, res) => {
    const { question, op1, op2, op3, answer } = req.body

    // Create Question
    const myQuestion = await Question.create({ question, op1, op2, op3, answer })

    if (myQuestion) {
        res.status(201).json(myQuestion)
    }
    else {
        res.status(400)
        throw new Error('Question could not be created')
    }

})

// @des     Create questions in bulk
// @route   POST /api/questions
// @access  Private 
const createBulkQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.bulkCreate(req.body)

    if (questions) {
        res.status(201).json({ "message": "Questions created" })
    }
    else {
        res.status(400)
        throw new Error('Questions could not be created')
    }

})

// @des     Update question
// @route   PUT /api/:id
// @access  Private 
const updateQuestion = asyncHandler(async (req, res) => {

    try {
        const question = await Question.findByPk(req.params.id)

        if (!question) {
            res.status(400)
            throw new Error('question not found')
        }

        const questionUpdated = await Question.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (questionUpdated) {
            res.status(200).json({ messege: 'Question updated' })
        }
        else {
            res.status(200).json({ messege: 'Question could not updated' })
        }


    } catch (error) {
        res.status(401)
        throw new Error('An Error occured while updating ')
    }

})

// @des Delete question
// @route   Delete /api/:id
// @access  Private
const deleteQuestion = asyncHandler(async (req, res) => {

    const question = await Question.findByPk(req.params.id)

    if (!question) {
        res.status(400)
        throw new Error('question not found')
    }

    try {
        await Question.destroy({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ id: req.params.id, messege: 'question deleted' })

    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Error occured while deleting question ')
    }
})

module.exports = {
    getQuestions,
    getQuestion,
    createQuestion,
    createBulkQuestions,
    updateQuestion,
    deleteQuestion
}