const express = require("express")
const router = express.Router()

const { getStatistics, saveStatistics } = require('../controllers/statisticsController')
// Protector middleware to protect access
const { protect } = require("../middleware/authMiddleware")

// Fetch statistics of a specific user, here id is of user
router.route('/:id').get(protect, getStatistics)
// Save statistics into database
router.post('/', protect, saveStatistics) 

module.exports = router