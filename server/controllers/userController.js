const mongoose = require("mongoose");
const User = mongoose.model("User");

/**
 * @function getUsers
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Get a list of all users from the database
 
 */
const getUsers = async (req, res) => {
  const users = await User.find().select("_id name email createdAt updatedAt");
  res.json(users);
};

/**
 *  @function getAuthUser
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Authenticates the User
 */
const getAuthUser = (req, res) => {
  if (!req.isAuthUser) {
    // return res.status(403).json({
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    // res.redirect("/signin");
    return res.redirect("/signin");
  }
  console.log(req.isAuthUser);
  res.json(req.user);
};

/**
 * @function getUserById
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {string} id
 * @returns {function}
 * @summary Get a user by id, also can get authenticated user
 */
const getUserById = async (req, res, next, id) => {
  const user = await User.findOne({ _id: id });
  req.profile = user;
  const profileId = mongoose.Types.ObjectId(req.profile._id);

  if (req.user && profileId.equals(req.user._id)) {
    req.isAuthUser = true;
    return next();
  }
  next();
};

/**
 * @function getUserProfile
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Get user profile data
 */
const getUserProfile = (req, res) => {
  if (!req.profile) {
    return res.status(404).json({
      message: "No user found",
    });
  }
  res.json(req.profile);
};

/**
 * @function getUserFeed
 */
const getUserFeed = () => {};

/**
 * @function uploadAvatar
 */
const uploadAvatar = () => {};

/**
 * @function resizeAvatar
 */
const resizeAvatar = () => {};

/**
 * @function updateUser
 */
const updateUser = () => {};

/**
 * @function deleteUser
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Deletes a user or your user account from the database
 */
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!req.isAuthUser) {
    return res.status(400).json({
      message: "You are not authorized to perform this action",
    });
  }
  const deletedUser = await User.findOneAndDelete({ _id: userId });
  res.json(deletedUser);
};

/**
 * @function addFollowing
 */
const addFollowing = () => {};

/**
 * @function addFollower
 */
const addFollower = () => {};

/**
 * @function deleteFollowing
 */
const deleteFollowing = () => {};

/**
 * @function deleteFollower
 */
const deleteFollower = () => {};

module.exports = {
  getUsers,
  getAuthUser,
  getUserById,
  getUserProfile,
  getUserFeed,
  uploadAvatar,
  resizeAvatar,
  updateUser,
  deleteUser,
  addFollowing,
  addFollower,
  deleteFollowing,
  deleteFollower,
};
