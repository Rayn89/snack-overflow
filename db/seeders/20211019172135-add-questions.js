'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Questions', [
        {
        title: 'How do I roast beef?',
        content: "I'm trying to roast my beef but my beef won't roast. I have my oven set to 250. Please help",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          title: 'How do I blacken salmon?',
          content: "I'm trying to blacken my salmon but my salmon won't blacken. I have my stove set on high.",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'How do I boil water?',
          content: "I have my water in a pot. What do I do next?",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Please help *URGENT*',
          content: "I'm trying to impress my date at korean bbq, but I dont know what I'm doing. Should I cook my beef medium or can we eat it raw?",
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          },

    ], {});

  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('Questions', null, {});

  }
};
