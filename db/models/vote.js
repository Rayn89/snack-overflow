'use strict';
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    up: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
    },
    down: {
      type:DataTypes.BOOLEAN,
      allowNull: false,
    },
    userId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    answerId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
  }, {});
  Vote.associate = function(models) {
    Vote.belongsTo(models.User,{foreignKey:"userId"})
    Vote.belongsTo(models.Answer,{foreignKey:"answerId"})
  };
  return Vote;
};
