const {DataTypes} = require("sequelize")
const {sequelize} = require("../config/db")

const UserSession = sequelize.define(
  "usersessions",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull:false
    },
    device:{
        type: DataTypes.STRING(255),
        allowNull: true
    },
    location:{
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    ip_address:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastActive:{
        type: DataTypes.DATE,
        allowNull:false,
    },
    is_active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usersessions",
    timestamps: false, 
  }
);

module.exports = UserSession;