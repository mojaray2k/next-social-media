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
 * @param {object} req
 * @param {object} res
 * @returns {void}
 * @summary Get a list off all users that the authenticated user is not following
 */
const getUserFeed = async (req, res) => {
  // exclude users we are following
  const { following, _id } = req.profile;

  // prevent user from following themselves
  following.push(_id);

  // find all the users that are $nin (not in) the users followers array
  const users = await User.find({ _id: { $nin: following } }).select(
    "_id name avatar"
  );
  res.json(users);
};

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
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {function}
 * @summary Follow another user
 */
const addFollowing = async (req, res, next) => {
  const { followId } = req.body;

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { following: followId } }
  );
  next();
};

/**
 * @function addFollower
 * @param {object} req
 * @param {object} res
 * @returns {function}
 * @summary Shows user who is following them
 */
const addFollower = async (req, res) => {
  const { followId } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $push: { followers: req.user._id } },
    { new: true }
  );
  res.json(user);
};

/**
 * @function deleteFollowing
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {function}
 * @summary Unfollow another user
 */
const deleteFollowing = async (req, res, next) => {
  const { followId } = req.body;

  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { following: followId } }
  );
  next();
};

/**
 * @function deleteFollower
 * @param {object} req
 * @param {object} res
 * @returns {function}
 * @summary Shows user who is not following them
 */
const deleteFollower = async (req, res) => {
  const { followId } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: followId },
    { $pull: { followers: req.user._id } },
    { new: true }
  );
  res.json(user);
};

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
