const express = require("express")
const router = express.Router()
// Get controllers
const { getPackages, getPackage, createPackage,updatePackage, deletePackage } = require('../controllers/packageController')

router.get("/", getPackages)

router.get("/:id", getPackage)

router.post("/", createPackage)

router.delete('/:id', deletePackage)

router.put('/:id', updatePackage)

module.exports = router