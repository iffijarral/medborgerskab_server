const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models').User
const Package = require('../models').Package

// @des Get all users of type customer
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {

    const users = await User.findAll(
        {
            where: { type: 'customer' },
            attributes: {
                exclude: ['password']
            }
        }
    )

    res.status(200).json(users)
})


// @des     Register new User
// @route   POST /api/users
// @access  Public 
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, type, status } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please fill all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        res.status(401)
        throw new Error('Email already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10) // parameter is just number of rounds and 10 is default

    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        type,
        status
    })

    if (user) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            token: generateToken(user.id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid user data')
    }

})

// @des     Authenticate a user, if it exists then fetch its status and noOfTests data. 
// @route   POST /api/users/login
// @access  Public 
const authenticate = asyncHandler(async (req, res) => {

    const { email, password, type } = req.body

    // let active = false // Its true if user has an active package

    // let noOfTests = 0 // If user has an active package, then fetch no of allowed tests. It depends on purchsed package

    const user = await User.findOne({ where: { email, type } })

    if (user && (await bcrypt.compare(password, user.password))) {
        // User exists, now determine package info
        const data = await userPackageData(user)
        
        res.status(200).json(data)                 

    } else {
        res.status(401)
        throw new Error('Wrong credentials')
    }

})

// @des this function takes user as a parameter and determins user's associated package if any and return relevant info

const userPackageData = async(user) => {

    let active = false // Its true if user has an active package

    let noOfTests = 0 // If user has an active package, then fetch no of allowed tests. It depends on purchsed package
    
    const data = await User.findAll({
        where: { id: user.id },
        include: [{
            model: Package,
            attributes: ["numberoftests", "duration"],
        }]
    })

    // Check if user has purchsed any package. If not following condition will be false
    if (data && data[0].Packages.length > 0) {

        var packagePurchasedAt = data[0].Packages[0].UserPackage.createdAt
        const duration = data[0].Packages[0].duration
        active = getUserPackageStatus(packagePurchasedAt, duration)
        // status false means purchased package is expired, so noOfTests will be 0
        noOfTests = active ? data[0].Packages[0].numberoftests : 0

    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: true,
        active,
        noOfTests,
        token: generateToken(user.id)
    }       
    
    
}

// @des   It calculates the no of days between two dates
function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// @des Check whether the package duration is over
function getUserPackageStatus(purchasedAt, duration) {
    var today = new Date()
    const daysUsed = dateDiffInDays(purchasedAt, today)

    if (daysUsed <= duration)
        return true
    else
        return false
}

// @des     Send email having password reset instructions
// @route   POST /api/users/forgot-password
// @access  Public 
const forgotPassword = asyncHandler(async (req, res) => {

    const nodemailer = require('nodemailer');

    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
        res.status(400)
        throw new Error('Email does not exist in system')
    }

    const token = generateToken(user.id, '1h')

    const link = `${process.env.BASE_URL}/api/users/reset-password/${token}`

    const smtpConfig = {
        host: 'send.one.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'admin@medborgerskabsprove.dk',
            pass: 'Tabella1122'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
        },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
        from: process.env.MAILER_SERVICE_USERNAME,
        to: email,
        subject: 'Medborgerskabsprøve Password Reset',
        html: `<p>Dear User,</p> 
                <p>Please click the following link to reset your password</p>
                <p>-------------------------------------------------------------</p>
                <p><a href="${link}"> Click here to reset your password</a></p>
                <p>Thanks,</p>
                <p>Medborgerskabsprove.dk</p>
              `
    };

    transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
            console.log(error);
            res.status(400)
            throw new Error('There was an error while sending an email, please try again later or contact customer service. Thanks')

        } else {
            res.status(200).json({ message: 'An email having instructions to reset you password has been sent to given email address' })
        }
    });
})

// @des     Redirect to Reset password page in frontend after token verification 
// @route   GET /api/users/reset-password
// @access  Public 
const resetPassword = asyncHandler(async (req, res) => {
    // Get token from request
    const { token } = req.params

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        res.redirect(`${process.env.BASE_URL}/reset-password`)

    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Invalid token')
    }


    if (!token) {
        res.status(400)
        throw new Error('Bad request, token not found')
    }

    res.status(200).json({ token })
})

// @des     Update password
// @route   PUT /api/users/password
// @access  Private 
const updatePassword = asyncHandler(async (req, res) => {

    const { currentPassword, newPassword } = req.body

    const conditions = {
        id: req.user.id,

        type: 'customer'
    }

    // user was set in req in authMiddleware protect method
    const user = await User.findOne({ where: { ...conditions } })

    // Check for user and compare password   
    if (user && (await bcrypt.compare(currentPassword, user.password))) {
        // Hash new password
        const salt = await bcrypt.genSalt(10) // parameter is just number of rounds and 10 is default

        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await User.update({ password: hashedPassword }, {
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({ message: 'Password updated' })
    } else {
        res.status(401)
        throw new Error('Wrong current password')
    }

})

// @des     save new password
// @route   POST /api/users/save-password
// @access  Private 
const savePassword = asyncHandler(async (req, res) => {

    const { password } = req.body
    try {
        // Hash new password
        const salt = await bcrypt.genSalt(10) // parameter is just number of rounds and 10 is default

        const hashedPassword = await bcrypt.hash(password, salt)

        await User.update({ password: hashedPassword }, {
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({ message: 'Password updated' })
        
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Password could not be changed. Please contact the admin. Thanks')
    }
})

// @des     Get user data
// @route   GET /api/users/me
// @access  Private 
const getMe = asyncHandler(async (req, res) => {
    //Because this function is being called in a protected route, and in middleware user id is being set, so we have an user id available here

    const { id, name, email, phone, type } = await User.findByPk(req.user.id)

    res.status(200).json({
        id,
        name,
        email,
        phone,
        type
    })

})


// Generate JWT
const generateToken = (id, expires = '30d') => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expires
    })
}

module.exports = {
    getUsers,
    registerUser,
    authenticate,
    forgotPassword,
    resetPassword,
    updatePassword,
    savePassword,
    userPackageData,
    getMe
}