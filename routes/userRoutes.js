const express = require("express")
const router = express.Router()
// Get controllers
const { getUsers, registerUser, authenticate, forgotPassword, resetPassword, updatePassword, savePassword, getMe } = require('../controllers/userController')
// Protector middleware to protect access
const { protect } = require("../middleware/authMiddleware")

// authenticate user
router.post('/login', authenticate)
// Fetch users if requesting user is autherized, and register new user
router.route('/').get(protect, getUsers).post(registerUser)
 
// Here an email is sent to user 
router.post('/forgot-password', forgotPassword) 

// User sent token via email link is verified and redirect to set new password 
router.get('/reset-password/:token', resetPassword) 

// update password
router.put('/reset-password', protect, updatePassword)

// save new password
router.post('/save-password', protect, savePassword)

// Get current user data if the user is logged in 
router.get('/me', protect, getMe)

module.exports = router