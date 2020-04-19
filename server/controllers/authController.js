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
 * @returns
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
 * @returns {void}
 */
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password });
  await User.register(user, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(user);
  });
};

/**
 * @function signin
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {object} passport
 * @returns {void}
 */
const signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }

      res.json(user);
    });
  })(req, res, next);
};

/**
 * @function
 */
const signout = () => {};
/**
 * @function
 */
const checkAuth = () => {};

module.exports = {
  validateSignup,
  signup,
  signin,
  signout,
  checkAuth,
};
