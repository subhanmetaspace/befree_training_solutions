const {DataTypes} = require("sequelize")
const {sequelize} = require("../config/db")

const ContactUs = sequelize.define(
  "contactus",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(20)
    },
    message: {
      type: DataTypes.STRING(500)
    },
    status: {
      type: DataTypes.ENUM("resolved","pending"),
      defaultValue: "pending",
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
    tableName: "contactus",
    timestamps: false, 
  }
);

module.exports = ContactUs;