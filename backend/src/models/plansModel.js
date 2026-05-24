const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Plans = sequelize.define(
  "plans",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "month",
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    cta: {
      type: DataTypes.STRING(20),
    },
    popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "plans",
    timestamps: false,
  }
);

module.exports = Plans;
