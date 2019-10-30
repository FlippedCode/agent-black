const Sequelize = require('sequelize');

module.exports = DB.define('OfflineStat', {
  time: {
    type: Sequelize.INTEGER(30),
    allowNull: false,
    primaryKey: true,
  },
});
