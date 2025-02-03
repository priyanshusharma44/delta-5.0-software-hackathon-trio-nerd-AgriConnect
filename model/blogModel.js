const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Blog = sequelize.define("Blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  coverImg: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    validate: { min: 0, max: 5 },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Blog;
