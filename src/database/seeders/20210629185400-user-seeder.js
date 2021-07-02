'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        RoleId: 1,
        email: 'admin@mail.com',
        password: bcrypt.hashSync('password', 10),
        username: 'admin.rsp',
        photo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        RoleId: 2,
        email: 'fajar@mail.com',
        password: bcrypt.hashSync('password', 10),
        username: 'ffajar.pratama',
        photo: null,
        isActive: true,
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
