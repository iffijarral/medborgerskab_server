module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package", {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }, 
        numberoftests:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        price: {
            type: DataTypes.REAL,
            allowNull: true,            
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,            
        }
        // createdAt: {
        //     type: "TIMESTAMP",
        //     defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        //     allowNull: false,
        //   },
        // updatedAt: {
        //     type: "TIMESTAMP",
        //     defaultValue: sequelize.literal(
        //         "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        //       ),
        //     allowNull: false,
        // }
        
    })

    Package.associate = (models) => {
        Package.belongsToMany(models.User, {
            through: "UserPackage"
        }),
        Package.hasMany(models.Payment)               
        
    }

    return Package
}