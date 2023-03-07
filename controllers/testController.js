const asyncHandler = require("express-async-handler")
const Test = require("../models").Test
const Question = require("../models").Question
const Exam = require("../models").Exam

// @des     Get tests
// @route   GET /api/tests
// @access  Private 
const getTests = asyncHandler(async (req, res) => {

    const tests = await Test.findAll() // Fetching all tests    

    if (tests) {
        res.status(200).json(tests)
    }
    else {
        res.status(400)
        throw new Error('No test available')
    }


})

// @des     Get single test including associated questions
// @route   GET /api/test/id
// @access  Private 
const getTest = asyncHandler(async (req, res) => {
    const id = req.params.id
    const test = await Test.findAll({
        where: { id },
        attributes: ["title"],
        include: [{
            model: Question,
            attributes: ["question", "op1", "op2", "op3", "answer"]
        }]
    })

    if (test) {
        res.status(200).json(test[0])
    }
    else {
        res.status(400)
        throw new Error('Invalid test ID')
    }
})

// @des     Create a test
// @route   POST /api/tests
// @access  Private 
const createTest = asyncHandler(async (req, res) => {
    const { title, status } = req.body

    // Check if test already exists
    const testExists = await Test.findOne({ where: { title } })

    if (testExists) {
        res.status(400)
        throw new Error('Test already exists')
    }

    // Create test
    const test = await Test.create({ title, status })

    if (test) {
        res.status(201).json(test)
    }
    else {
        res.status(400)
        throw new Error('Test could not be created')
    }

})

// @des     Create tests in bulk
// @route   POST /api/tests
// @access  Private 
const createBulkTests = asyncHandler(async (req, res) => {
    const tests = await Test.bulkCreate(req.body)

    if (tests) {
        res.status(201).json({ "message": "tests created" })
    }
    else {
        res.status(400)
        throw new Error('Tests could not be created')
    }

})

module.exports = {
    getTests,
    getTest,
    createTest,
    createBulkTests    
}