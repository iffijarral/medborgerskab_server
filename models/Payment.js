module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define("Payment", {
        txn_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_gross: {
            type: DataTypes.REAL,
            allowNull: true,            
        },
        currency_code: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        payer_email: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: true,            
        }
        
    })

    Payment.associate = (models) => {
        Payment.belongsTo(models.User),
        Payment.belongsTo(models.Package)               
        
    }

    return Payment
}