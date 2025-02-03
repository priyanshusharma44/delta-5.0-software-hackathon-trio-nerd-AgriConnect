const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Subscriber = sequelize.define("Subscriber", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  subscribedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Subscriber;
