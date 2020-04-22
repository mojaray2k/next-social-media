const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");

/**
 * @function validateSignup
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @summary Middleware function that will help validate data from form
 * inputs
 * @returns {void} or @returns {error}
 */
const validateSignup = (req, res, next) => {
  /**
   * sanitizedBoy is an Express-Validator method which
   * used to prevent insertion of malicious code in
   */
  req.sanitizeBody("name");
  req.sanitizeBody("email");
  req.sanitizeBody("password");

  /**
   *  In the Name field make sure it is non-null and
   * is 4 to 10 characters long using Express-Validator's checkBody
   */
  req.checkBody("name", "Enter a name").notEmpty();
  req
    .checkBody("name", "Name must be between 4 and 10 characters")
    .isLength({ min: 4, max: 10 });

  /**
   *  In the Email field make sure it is non-null, valid, and
   *  normalized, using Express-Validator's checkBody
   */

  req.checkBody("email", "Enter a valid email").isEmail().normalizeEmail();

  /**
   *  In the Passowrd field make sure it is non-null and
   * is 4 to 10 characters long using Express-Validator's checkBody
   */
  req.checkBody("password", "Enter a password").notEmpty();
  req
    .checkBody("password", "Password must be between 4 and 10 characters")
    .isLength({ min: 4, max: 10 });

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).send(firstError);
  }
  next();
};

/**
 * @function signup
 * @param {object} req
 * @param {object} res
 * @returns {void} or @returns {error}
 * @summary Sign up a new user to the application
 */
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  await User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(user.name);
  });
};

/**
 * @function signin
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {object} passport
 * @returns {void}
 * @summary Sign in a existing user to the application
 */
const signin = (req, res, next) => {
  /**
   * @function authenticate
   * @param {object} err @description Error object
   * @param {object} user @description User object
   * @param {object} info @description Information object
   * @returns {void} or @returns {error} or @returns {information}
   * @summary authenticate is a @external Passport method
   * {@link http://www.passportjs.org/packages/passport-local/#authenticate-requests}
   */
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    /**
     * @function login
     * @param {object} err @description Error object
     * @param {object} user @description User object
     * @returns {object} User Object or @returns {error}
     * @summary login is a @external Passport method
     * {@link http://www.passportjs.org/docs/login/}
     */
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }

      res.json(user);
    });
  })(req, res, next);
};

/**
 * @function signout
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Sign out an existing user from the application
 */
const signout = (req, res) => {
  /**
   * @method clearCookie
   * @summary This is an @memberof Express The next-cookie.sid is create on line 66
   * of app.js as a part of the sessionConfig object
   * {@link http://expressjs.com/en/4x/api.html#res.clearCookie}
   */
  res.clearCookie("next-cookie.sid");
  /**
   * @function logout
   * @summary logout is a @external Passport method
   * {@link http://www.passportjs.org/docs/logout/}
   */
  req.logout();
  res.json({ message: "You are now signed out!" });
};

/**
 * @function checkAuth
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {function} next
 * or @returns {void} and redirects to the sign page
 */
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

module.exports = {
  validateSignup,
  signup,
  signin,
  signout,
  checkAuth,
};
