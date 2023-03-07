module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define("Test", {
        title: {
            type: DataTypes.STRING,
            allowNull: true,            
        },        
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,            
        }
    })

    Test.associate = (models) => {
        
        Test.belongsToMany(models.Question, {
            through: "TestQuestion"
        }),
        Test.hasMany(models.Statistics, {
            onDelete: "cascade"
        })        
    }

    return Test
}