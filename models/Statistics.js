module.exports = (sequelize, DataTypes) => {
    const Statistics = sequelize.define("Statistics", {
        answers: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },         
        testdate: {
            type: DataTypes.DATE,
            allowNull: true,            
        },
        
    })

    Statistics.associate = (models) => {
        Statistics.belongsTo(models.User)               
    },
    Statistics.associate = (models) => {
        Statistics.belongsTo(models.Test)               
    }

    return Statistics
}