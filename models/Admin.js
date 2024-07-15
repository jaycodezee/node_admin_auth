// Admin.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path as per your project structure

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetPasswordExpires: { 
    type: DataTypes.DATE,
    allowNull: true,
  },
},{
  freezeTableName:true,
  timestamps:false
});

module.exports = Admin;
