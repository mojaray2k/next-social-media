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
 *
 */
const getAuthUser = () => {};
/**
 *
 */
const getUserById = () => {};
/**
 *
 */
const getUserProfile = () => {};
/**
 *
 */
const getUserFeed = () => {};
/**
 *
 */
const uploadAvatar = () => {};
/**
 *
 */
const resizeAvatar = () => {};
/**
 *
 */
const updateUser = () => {};
/**
 *
 */
const deleteUser = () => {};
/**
 *
 */
const addFollowing = () => {};
/**
 *
 */
const addFollower = () => {};
/**
 *
 */
const deleteFollowing = () => {};
/**
 *
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
