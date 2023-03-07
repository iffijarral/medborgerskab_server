module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        question: {
            type: DataTypes.STRING,
            allowNull: true,            
        },        
        op1: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        op2: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        op3: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: true,            
        }
    })

    Question.associate = (models) => {
        
        Question.belongsToMany(models.Test, {
            through: "TestQuestion"
        }),
        Question.belongsToMany(models.PrevExam, {
            through: "PrevExamQuestion"
        })
        
    }

    return Question
}