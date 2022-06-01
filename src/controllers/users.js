// THIS KEY SHOULD BE PROVIDED AN ENV FILE AND BE KEPT SECRET
// IN A PRODUCTION ENVIRONMENT
const DUMMY_TOKEN_KEY = 'DUMMY_TOKEN_KEY';

module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  function login(req, res) {
    // renders the appropriate template
    res.render('login');
  }

  function register(req, res) {
    // renders the appropriate template
    res.render('register');
  }

  function logout(req, res) {
    // Remove the token to logout the user
    return res
      .clearCookie("access_token")
      .status(200)
      .redirect('/');
  }

  async function loginPost(req, res) {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400);
      return res.render('login', { message: { type: 'danger', text: "All input is required, please try again!" } });
    }

    // Validate if user exist in our database
    const user = await db.User.findOne({ where: { email: email } });

    // Validate password
    if (user && user.validPass(password)) {
      // Create token
      const token = user.signToken(DUMMY_TOKEN_KEY);

      // Assign token as a cookie and redirect to index page
      return res.
        cookie("access_token", token, { httpOnly: true }).
        redirect('/');
    }

    // Invalid password, redirect to login page with error message
    res.status(400)
    res.render('login', { message: { type: 'danger', text: "Invalid credentials, please try again!" } });
  }

  async function registerPost(req, res) {
    const { firstName, lastName, email, password } = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(400);
      return res.render('register', { message: { type: 'danger', text: "All input is required, please try again" } });
    }

    // Check if user already exist
    const oldUser = await db.User.findOne({ where: { email: email } });

    if (oldUser) {
      res.status(409);
      return res.render('login', { message: { type: 'danger', text: "User Already Exists. Please Login!" } });
    }

    //Encrypt user password
    const encryptedPassword = db.User.hashPassSync(password);

    // Create user in our database
    const user = await db.User.create({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword
    });

    // Create token
    const token = user.signToken(DUMMY_TOKEN_KEY);

    // Assign token as a cookie and redirect to index page
    return res.
      cookie("access_token", token, { httpOnly: true }).
      redirect('/');
  }

  router.get('/login', login)
  router.post('/login', loginPost)
  router.get('/logout', logout)
  router.get('/register', register)
  router.post('/register', registerPost)

  return router;
}