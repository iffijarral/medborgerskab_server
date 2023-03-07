const asyncHandler = require('express-async-handler')
const Package = require('../models').Package
const Payment = require('../models').Payment
const User = require('../models').User

const { userPackageData } = require('./userController')

const stripe = require("stripe")(process.env.STRIPE_SEC_KEY);

// @des Get Stripe public key
// @route   GET /api/payments/get-public-key
// @access  Private

const getPublicKey = asyncHandler(async (req, res) => {
    res.send({
        publicKey: process.env.STRIPE_PUB_KEY
    });
})

// @des CreatePaymentIntent
// @route   GET /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {

    const { packageID, receipt_email } = req.body;

    const package = await Package.findByPk(packageID)

    try {
        if (package) {
            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: package.price * 100,
                currency: "dkk",
                receipt_email,
                automatic_payment_methods: {
                    enabled: true
                }
            });

            res.send({
                clientSecret: paymentIntent.client_secret
            });
        } else {
            res.status(400)
            throw new Error('Invalid package, no record found')
        }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

// @des Save Payment
// @route   POST /api/payments/save-payment-transaction
// @access  Private

const savePaymentTransaction = asyncHandler(async (req, res) => {
    const { UserId, PackageId } = req.body

    const user = await User.findByPk(UserId)

    const package = await Package.findByPk(PackageId)

    try {
        const payment = await Payment.create({ ...req.body })

        if (payment) {
            if(saveUserPackage(user, package) && updateUserStatus(user.id)) {
            
                const updatedUserData = userPackageData(user) // This function returns updated user information like token, noOfTests and status

                res.send({
                    ...updatedUserData,
                    paymentId: payment.id,
                    paymentStatus: payment.payment_status
                });
            }                    
            else {
                res.status(400)
                throw new Error('Record could not be saved. Please contact admin.')    
            }
        }
        else {
            res.status(400)
            throw new Error('Invalid package, no record found')
        }
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }

})

// @des Save UserPackage
// @route   It doesn't have any route. It is called from inside
// @access  Private

const saveUserPackage = asyncHandler(async (user, package) => {    

    const result = await user.addPackage(package)

    if (result)
        return true

    return false
})

const updateUserStatus = asyncHandler(async (userID) => {
    try {
        const result = await User.update({ status: true }, {
            where: {
                id: userID
            }
        });

        if (result)
            return true

        return false
    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('User status could not be updated')
    }


})

module.exports = { getPublicKey, createPaymentIntent, savePaymentTransaction }