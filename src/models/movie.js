/**
 * 
 * @param {*} sequelize initialized sequalize instance for defining the model
 * @param {*} Sequelize sequelize library for referencing the datatypes
 * @returns Movie model
 */
module.exports = (sequelize, Sequelize) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: Sequelize.STRING
    },
    // Having likes and hates not only as an associated model but also
    // as a property on the movie model allows for easier and more performant querying & ordering.
    // Synchronization between the two sources of truth happens as a post save hook on the vote model.
    likes: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    hates: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
  });
  return Movie;
};

