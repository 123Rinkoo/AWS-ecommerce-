const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`${process.env.TableName}`, `${process.env.User_Name}`, `${process.env.Password}` , {
  dialect: 'mysql',
  host: process.env.Host
});

module.exports = sequelize;
