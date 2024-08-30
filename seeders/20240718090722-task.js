"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "newtask",
      [
        {
          taskName: "This is task number one!",
        },
        {
          taskName: "This is task number two!",
        },
        {
          taskName: "This is task number three!",
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
     * await queryInterface.bulkDelete('Tasks', null, {});
     */
  },
};
