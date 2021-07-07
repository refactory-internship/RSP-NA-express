'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PhotoUsers', [
      {
        UserId: 1,
        cloudinary_public_id: null,
        cloudinary_secure_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: 2,
        cloudinary_public_id: null,
        cloudinary_secure_url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
