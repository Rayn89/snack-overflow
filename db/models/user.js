'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type:DataTypes.STRING(50),
      allowNull:false,
      unique:true
    },
    email: {
      type:DataTypes.STRING(255),
      allowNull:false,
      unique:true
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Question,{foreignKey:"userId"});
    User.hasMany(models.Answer, { foreignKey: 'userId' });
  };
  return User;
};
