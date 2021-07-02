'use strict';

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    email: DataTypes.STRING,
    token: DataTypes.STRING
  });

  return Token;
};