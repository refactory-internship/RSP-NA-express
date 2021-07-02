'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Notes', [
      {
        UserId: 2,
        title: 'First note title',
        body: 'First note body',
        password: null,
        type: 'info',
        isSecret: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        title: 'Second secret title',
        body: 'Second secret body',
        password: 'password',
        type: 'credential',
        isSecret: true,
        createdAt: new Date(),
        updatedAt: new Date()
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
