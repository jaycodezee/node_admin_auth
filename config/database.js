const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
    host: "localhost",
    dialect: "postgres",
  });

  sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error connecting to database: ', err));

module.exports = sequelize;