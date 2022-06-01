const url = require('url')
const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  async function getNew(req, res) {
    let currentUser = req.currentUser;

    const data = { currentUser: currentUser }
    res.render('movieForm', data)
  }

  async function postNew(req, res) {
    const currentUser = req.currentUser;
    const { title, description } = req.body;

    await db.Movie.create({
      title: title,
      description: description,
      UserId: currentUser.id
    })

    res.redirect('/');
  }

  async function upvote(req, res) {
    const currentUser = req.currentUser;
    const movieId = req.params.movieId;

    await setVoteValue(currentUser.id, movieId, db.Vote.UP);

    res.redirect(url.format({
      pathname: "/",
      query: req.query,
    }));
  }

  async function downvote(req, res) {
    const currentUser = req.currentUser;
    const movieId = req.params.movieId;

    await setVoteValue(currentUser.id, movieId, db.Vote.DOWN);

    res.redirect(url.format({
      pathname: "/",
      query: req.query,
    }));
  }

  async function clearVote(req, res) {
    const currentUser = req.currentUser;
    const movieId = req.params.movieId;

    await setVoteValue(currentUser.id, movieId, db.Vote.CLEAR);

    res.redirect(url.format({
      pathname: "/",
      query: req.query,
    }));
  }

  async function setVoteValue(userId, movieId, newValue) {
    let [vote, created] = await db.Vote.findOrCreate({
      where: {
        UserId: userId,
        MovieId: movieId
      }
    });

    vote.value = newValue;
    await vote.save();
  }

  router.get('/new', getNew)
  router.post('/new', postNew)
  router.get('/up/:movieId', upvote)
  router.get('/down/:movieId', downvote)
  router.get('/clear/:movieId', clearVote)

  return router;
}