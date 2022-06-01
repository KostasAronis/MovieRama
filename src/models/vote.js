/**
 * 
 * @param {*} sequelize initialized sequalize instance for defining the model
 * @param {*} Sequelize sequelize library for referencing the datatypes
 * @returns Movie model
 */
module.exports = (sequelize, Sequelize) => {
  /**
   * Vote uses a composite primary key consisting of userId & movieId since we only
   * allow for a single vote from each user to each movie
   */
  const Vote = sequelize.define('Vote', {
    UserId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    MovieId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    value: {
      type: Sequelize.INTEGER,
      validate: {
        min: -1,
        max: 1
      }
    }
  }, {
    hooks: {
      // this after save hook deals with syncing our movie likes / hates when creating
      // or updating a new vote
      afterSave: async (vote, options) => {
        let movie = await sequelize.models.Movie.findByPk(vote.MovieId)
        if (vote.value == Vote.UP) {
          movie.likes += 1
        } else if (vote.value == Vote.DOWN) {
          movie.hates += 1
        }

        if (vote._previousDataValues.value) {
          // this is a vote that has changed value
          // we need to reduce the counter of likes / hates
          if (vote._previousDataValues.value == Vote.UP) {
            movie.likes -= 1
          } else if (vote._previousDataValues.value == Vote.DOWN) {
            movie.hates -= 1
          }
        }

        await movie.save();
      }
    }
  });

  // Constant vote values for use throughout our app
  Vote.UP = 1;
  Vote.DOWN = -1;
  Vote.CLEAR = 0;

  return Vote;
};

