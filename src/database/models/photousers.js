'use strict';

module.exports = (sequelize, DataTypes) => {
  const PhotoUsers = sequelize.define('PhotoUsers', {
    cloudinary_public_id: DataTypes.STRING,
    cloudinary_secure_url: DataTypes.STRING
  });

  PhotoUsers.associate = models => {
    PhotoUsers.belongsTo(models.User, {
      onDelete: 'CASCADE'
    });
  }

  return PhotoUsers;
};