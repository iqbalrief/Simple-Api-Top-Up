'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
  
    static associate(models) {
     
    }
  }
  Services.init({
      service_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 20],
        }
      },
      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 100],
        }
      },
      service_icon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isUrl: true,
        }
      },
      service_tarif: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true, 
          min: 0 
        }
      }
  }, {
    sequelize,
    modelName: 'Services',
  });
return Services;
};