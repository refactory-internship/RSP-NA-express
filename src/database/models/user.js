'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    photo: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  });

  User.associate = models => {
    User.belongsTo(models.Role);
    User.hasMany(models.Note);
  }

  return User;
};