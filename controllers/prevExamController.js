const asyncHandler = require("express-async-handler")
const sequelize = require("sequelize")
const Question = require("../models").Question
const PrevExam = require("../models").PrevExam
// @des     Get prev exams
// @route   GET /api/prevexams
// @access  Private 
const getPrevExams = asyncHandler(async (req, res) => {

    const prevExams = await PrevExam.findAll({
        order: [['year', 'desc']],        
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('year')) ,'year'], 'id'],        
        group: ['year']
    })    

    if (prevExams) {
        res.status(200).json(prevExams)
    }
    else {
        res.status(400)
        throw new Error('No previous exam available')
    }
})

// @des     Get single exam including associated questions
// @route   GET /api/prevexam/id
// @access  Private 
const getPrevExam = asyncHandler(async (req, res) => {
    const { id, season } = req.params    
    const exam = await PrevExam.findAll({
        where: { id, season },
        attributes: ["year", "season"],
        include: [{
            model: Question,
            attributes: ["id", "question", "op1", "op2", "op3", "answer"]
        }]
    })

    if (exam) {
        res.status(200).json(exam[0])
    }
    else {
        res.status(400)
        throw new Error('No data available.')
    }
})

// @des     Create a prev exam
// @route   POST /api/prevexams
// @access  Private 
const createPrevExam = asyncHandler(async (req, res) => {
    const { year, season } = req.body

    // Check if test already exists
    const prevExam = await PrevExam.findOne({ where: { year, season } })

    if (prevExam) {
        res.status(400)
        throw new Error('Exam already exists')
    }

    // Create test
    const exam = await PrevExam.create({ year, season })

    if (exam) {
        res.status(201).json(exam)
    }
    else {
        res.status(400)
        throw new Error('Exam could not be created')
    }

})

module.exports = {
    getPrevExams,
    getPrevExam,
    createPrevExam
}