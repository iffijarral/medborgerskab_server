const express = require("express")
const router = express.Router()
// Protector middleware to protect access
const { protect } = require("../middleware/authMiddleware")
// Get controllers
const { createPaymentIntent, savePaymentTransaction, getPublicKey } = require('../controllers/paymentController')

router.post("/create-payment-intent", protect, createPaymentIntent)

router.post("/save-payment-transaction", protect, savePaymentTransaction)

router.get("/get-public-key", protect, getPublicKey)

module.exports = router