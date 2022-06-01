const jwt = require('../lib/jwt');

/**
 * Authentication middleware that validates access_token cookie
 * and assigns user object to req for easier usage in controllers
 * @param {*} db object for accessing the database
 * @param {*} required if true will block the request on invalid token
 * @returns 
 */
module.exports = (db, required) => {
  return async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      if (required) {
        return res.sendStatus(403);
      }
      return next();
    }
    try {
      const data = jwt.verify(token);

      let userId = data.userId;
      let userEmail = data.email;
      if (userId && userEmail) {
        let currentUser = await db.User.findByPk(userId);

        if (currentUser) {
          req.currentUser = currentUser;
        } else {
          if (required) {
            return res.sendStatus(403);
          }
        }
      }

      return next();
    } catch {
      // Clearing cookie since it is invalid.
      res.clearCookie("access_token");

      if (required) {
        return res.sendStatus(403);
      }
      return next();
    }
  }
}