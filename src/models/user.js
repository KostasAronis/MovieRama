const bcrypt = require('bcrypt');
const jwt = require('../lib/jwt')

/**
 * 
 * @param {*} sequelize initialized sequalize instance for defining the model
 * @param {*} Sequelize sequelize library for referencing the datatypes
 * @returns User model
 */
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING
    },
  }, {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ['email']
      },
    ]
  });

  // Hashes a given plaintext.
  User.hashPassSync = function (plaintext) {
    return bcrypt.hashSync(plaintext, 10);
  }

  /**
   * @param {string} freeTextPass password to test against user's stored encrypted pass
   * @returns {bool} whether or not the pass was valid
   */
  User.prototype.validPass = function (freeTextPass) {
    return bcrypt.compareSync(freeTextPass, this.password)
  }

  User.prototype.signToken = function () {
    return jwt.sign({ userId: this.id, email: this.email });
  }

  return User;
};

