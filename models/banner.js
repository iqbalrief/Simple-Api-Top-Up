'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init({
    banner_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,              
        len: [3, 100],              
      }
    },
    banner_image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true,                
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255],    
      }
    }
  }, {
    sequelize,
    modelName: 'Banner',
  });
  return Banner;
};