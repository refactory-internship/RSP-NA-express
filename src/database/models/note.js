'use strict';

module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.STRING,
    isSecret: DataTypes.BOOLEAN
  },
    { paranoid: true });

  Note.associate = models => {
    Note.belongsTo(models.User);
  }

  return Note;
};