module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define("Exam", {
        examdate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        registrationdate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fee: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    })

    return Exam
}