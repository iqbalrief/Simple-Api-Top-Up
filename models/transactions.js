'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
   
    static associate(models) {
      Transactions.belongsTo(models.Users, { foreignKey: 'user_id' });
    }
  }
  Transactions.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1, 
      }
    },
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500],
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0.01,
      }
    },
  }, {
    sequelize,
    modelName: 'Transactions',
  });
  return Transactions;
};