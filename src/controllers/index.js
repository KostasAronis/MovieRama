const auth = require('../middlewares/authJWT');

module.exports = (db) => {
  var express = require('express');
  var router = express.Router();

  /**
   * 
   * @param {*} votes Array of vote objects
   * @returns a hash containing keys 'up' & 'down' pointing to the array of users that voted up or down
   * 
   * eg.
   * { 'up': [1, 3, 4], 'down': [2, 5] }
   */
  function splitVotes(votes) {
    return votes.reduce((accumulator, vote) => {
      if (vote.value == db.Vote.UP) {
        accumulator['up'].push(vote.UserId)
      }
      if (vote.value == db.Vote.DOWN) {
        accumulator['down'].push(vote.UserId)
      }

      return accumulator;
    }, { 'up': [], 'down': [] })
  }

  // Main controller function for our app's index page
  async function get(req, res) {
    let currentUser = req.currentUser || null;

    let orderBy = req.query.orderBy;
    let userId = req.query.userId;

    // Eager loading movie's user and votes
    let query = {
      include: [
        {
          model: db.User,
          as: 'User'
        },
        {
          model: db.Vote,
          as: 'Votes'
        }
      ]
    };

    // filtering by userId if one is present in the query sting
    if (userId) {
      query['where'] = { 'UserId': userId }
    }

    // ordering by either likes, hates or createdAt
    if (orderBy) {
      switch (orderBy) {
        case 'likes':
          query['order'] = [['likes', 'DESC']]
          break;
        case 'hates':
          query['order'] = [['hates', 'DESC']]
          break;
        case 'date':
          query['order'] = [['createdAt', 'DESC']]
          break;
        default:
          break;
      }
    }

    let movies = await db.Movie.findAll(query) || []

    movies = movies.map(function (movie) {
      movie.setDataValue('splitVotes', splitVotes(movie.Votes));
      return movie;
    })

    const data = {
      currentUser: currentUser,
      searchParams: req.query,
      movies: JSON.parse(JSON.stringify(movies))
    };

    res.render('index', data);
  }

  router.get('/', get)
  return router;
}
