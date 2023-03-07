const asyncHandler = require('express-async-handler')
const User = require('../models').User
const Test = require('../models').Test
const Statistics = require('../models').Statistics

// @des Get user statistics
// @route   GET /api/users/:id/:action
// @access  Private
const getStatistics = asyncHandler(async (req, res) => {
    const id = req.params.id

    const statistics = await User.findAll(
        {
            attributes: ["id", "name"],
            where: { id },
            include: [{
                model: Statistics,
                attributes: ["answers", "testdate"],
                include: [{
                    model: Test,
                    attributes: ["title"]
                }]
            }]
        }
    )

    if (statistics) {
        res.status(200).json(statistics)
    }
    else {
        res.status(400)
        throw new Error('No record found')
    }
})

// @des Save statistics
// @route   POST /api/statistics
// @access  Private
const saveStatistics = asyncHandler(async (req, res) => {
    const { userID, testID, rightAnswers } = req.body

    const statistics = await Statistics.create({
        answers: rightAnswers,
        testdate: new Date(),
        UserId: userID,
        TestId: testID
        
    }
    )

    if (statistics) {
        res.status(201).json(statistics)
    }
    else {
        res.status(400)
        throw new Error('No record found')
    }
})

module.exports = {
    getStatistics,
    saveStatistics
}