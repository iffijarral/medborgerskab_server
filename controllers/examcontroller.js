const asyncHandler = require("express-async-handler")
const Exam = require("../models").Exam

// @des     Get exam data like exam-date, fee 
// @route   GET /api/tests/exam-data
// @access  Public
const getExamData = asyncHandler(async (req, res) => {
    console.log('in examdata')
    const examData = await Exam.findAll()
    
    if (examData.length > 0) {
        res.status(200).json(examData)
    }
    else {
        res.status(400)
        throw new Error('Sorry for inconvenience, No data available. Please do contact the admin. Thanks')
    }
})

module.exports = { getExamData }