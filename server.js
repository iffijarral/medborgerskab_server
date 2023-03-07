const express = require("express")
const dotenv = require("dotenv").config()
const fileUpload = require("express-fileupload")
const {errorHandler} = require('./middleware/errorMiddleware')
const port = process.env.PORT || 3001

const app = express()
 
const cors = require("cors")

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended: false}))


const db = require('./models')

// enalble files upload
app.use(fileUpload({ createParentPath: true }))

app.use("/api/users", require("./routes/userRoutes"))

app.use("/api/packages", require("./routes/packageRoutes"))

app.use("/api/tests", require("./routes/testRoutes"))

app.use("/api/questions", require("./routes/questionRoutes"))

app.use("/api/exam", require("./routes/examRoutes")) // Exam info i.e. exam date, registration last date and fee

app.use("/api/prevexams", require("./routes/prevExamRoutes"))

app.use("/api/statistics", require("./routes/statisticsRoutes"))

app.use("/api/payments", require("./routes/paymentRoutes"))

app.use(errorHandler) // Error handling

// Make alter: true, when there is need to align model(s) with database 
db.sequelize.sync({force: false, alter: false}).then(() => {
    console.log("Database is ready to use")
    app.listen(port, ()=>{ console.log("server is running at: port"+port) })
})
