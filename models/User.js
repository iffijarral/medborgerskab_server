module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true            
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,            
        }
    })

    User.associate = (models) => {
        User.hasMany(models.Payment, {
            onDelete: "cascade"
        }),
        User.hasMany(models.Statistics, {
            onDelete: "cascade"
        }),
        User.belongsToMany(models.Package, {
            through: "UserPackage"
        })
        
    }

    return User
}