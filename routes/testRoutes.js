const express = require("express")
const router = express.Router()
// Get controllers
const { getTests, getTest, createTest,createBulkTests, deleteTest } = require('../controllers/testController')

router.get("/", getTests)

router.get("/:id", getTest)

router.post("/", createTest)

router.post("/bulkTests", createBulkTests)

// router.delete('/:id', deleteTest)

// router.put('/:id', updateTest)

module.exports = router