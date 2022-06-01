/**
 * TODOs:
 * PARSE IMDB?
 * AJAX?
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { Liquid } = require('liquidjs');

const db = require("./src/models/db.js");
const auth = require('./src/middlewares/authJWT');

const port = 1337;

const app = express();
const engine = new Liquid();

// BASIC EXPRESS SETUP
app.use(cookieParser());
app.use(cors({ origin: `http://localhost:${port}` }));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './src/views');
app.set('view engine', 'liquid');


// ROUTING & MIDDLEWARE SETUP
// note: routing should be housed in seperate files if this was not a simple prototype
function setupRouting(db) {
  const indexController = require('./src/controllers/index')
  const usersController = require('./src/controllers/users')
  const moviesController = require('./src/controllers/movies')

  app.use('/', auth(db, false), indexController(db));
  app.use('/user', usersController(db));
  app.use('/movie', auth(db, true), moviesController(db));
}

(async () => {
  try {
    await db.setup();

    setupRouting(db);

    // START LISTENING
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (err) {
    console.error("SOMETHING WENT WRONG DURING THE INITIALIZATION!")
    throw err;
  }
})();