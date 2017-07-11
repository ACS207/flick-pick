const Sequelize = require('sequelize');
const db = require('../dbsetup.js');


const Tag = db.define('Tag', {
  tagName: {
    type: Sequelize.STRING
  }
});

// Tag.sync().then((err) => {
//   if (err) {
//     console.error('Error creating Tag table', err);
//   } else {
//     console.log('Tag table created successfully');
//   }
// });

module.exports = Tag;
