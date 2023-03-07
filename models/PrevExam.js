module.exports = (sequelize, DataTypes) => {
    const PrevExam = sequelize.define("PrevExam", {
        year: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        season: {
            type: DataTypes.STRING,
            allowNull: true,            
        }        
    })

    PrevExam.associate = (models) => {
        
        PrevExam.belongsToMany(models.Question, {
            through: "PrevExamQuestion"
        })
        
    }

    return PrevExam
}