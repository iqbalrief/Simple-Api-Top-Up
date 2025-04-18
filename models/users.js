'use strict';
const {
  Model
} = require('sequelize');
const { v4: uuidv4 } = require('uuid');  
// const {Transactions} = require('./transactions')

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.Transactions, {
        foreignKey: 'user_id'
      });
    }
  }
  Users.init({
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{10,15}$/,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100],
      }
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      }
    },
    balance: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0,
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
    timestamps: true,
  });
  return Users;
};