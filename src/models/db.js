const { Sequelize } = require('sequelize');

// Initalize a Sequelize object by passing the database dialect and 'connection string'.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

// main db object carrying the connection and the models for easier usage
// throughout the application.
const db = {};

// Loading models
const User = require("./user.js")(sequelize, Sequelize);
const Movie = require("./movie.js")(sequelize, Sequelize);
const Vote = require("./vote.js")(sequelize, Sequelize);

// Creating model associations
Movie.belongsTo(User);
User.hasMany(Movie);

Vote.belongsTo(Movie, { onDelete: 'cascade' });
Vote.belongsTo(User, { onDelete: 'cascade' });
User.hasMany(Vote);
Movie.hasMany(Vote);

// Setting attributes to the main db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Movie = Movie;
db.Vote = Vote;

/**
 * Initializes the database object by connecting to the database,
 * initializing the schema and seeding initial data.
 */
db.setup = async function () {
  await connectDB(this);

  const userCount = await this.User.count();

  if (userCount == 0) {
    await seedDB(this);
  }

  return db;
}

module.exports = db;


// HELPER FUNCTIONS FOR CONNECTING AND SEEDING THE DATABASE
async function connectDB(db) {
  await db.sequelize.sync();

  return db;
}

async function seedDB(db) {
  const users = await seedUsers(db);
  const movies = await seedMovies(db, users);
  const votes = await seedVotes(db, users, movies);

  return db;
}


// SEED FUNCTIONS CONTAINING INITAL DATA FOR THE APPLICATION
async function seedUsers(db) {
  const users = await db.User.bulkCreate([
    {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      password: db.User.hashPassSync('test')
    },
    {
      firstName: 'Someone',
      lastName: 'Else',
      email: 'some@one.com',
      password: db.User.hashPassSync('test')
    }
  ])

  return users;
}

async function seedMovies(db, users) {
  const movies = await db.Movie.bulkCreate([
    {
      title: 'Eternal Sunshine of the Spotless Mind',
      description: 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.',
      UserId: users[0].id
    },
    {
      title: 'Taxi Driver',
      description: 'A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.',
      UserId: users[0].id
    },
    {
      title: 'Everything Everywhere All at Once',
      description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
      UserId: users[1].id
    }
  ])

  return movies;
}

async function seedVotes(db, users, movies) {
  // we use simple create in order for the afterSaveHook to work properly
  const vote = await db.Vote.create(
    {
      UserId: users[1].id,
      MovieId: movies[0].id,
      value: db.Vote.UP
    }
  )

  return vote;
}
