const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Sequelize } = require('sequelize');
const routes = require('./src/routes');
const dotenv = require('dotenv');
dotenv.config();

const DB = require('./src/config/database');
const sequelize = new Sequelize(DB.development);

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//test database connection
try {
  sequelize.authenticate();
  console.log('Connection to the database has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.use(routes);
// app.use(errorHandler);

module.exports = app;
