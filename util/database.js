const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`${process.env.TableName}`, 'root', `${process.env.Password}` , {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
