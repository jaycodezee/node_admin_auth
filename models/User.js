// model/user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path as per your project structure
const Admin = require("./Admin");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: Admin,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Admin.hasMany(User, { foreignKey: "adminId" });
User.belongsTo(Admin, { foreignKey: "adminId" });

module.exports = User;
