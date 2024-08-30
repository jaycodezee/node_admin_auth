"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "newuser1",
      [
        {
          Name: "John ",
        },
        {
          Name: " Doe",
        },
        {
          Name: "nkjw Doe",
        },
        {
          Name: "dm Doe",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
