const { userModel } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

async function createUser(body) {
    const user = await userModel.create(body);
    return user;
}

async function getUserById(id) {
    const user = await userModel.findById(id);
    return user;
}

async function getOne(query) {
  const user = await userModel.findOne(query);
  return user;
}

async function updateUser(filter, body) {
  const userData = await getOne(filter);
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const user = await userModel.findOneAndUpdate(filter, body, { new: true });
  return user;
}

async function removeUser(filter) {
  const user = await userModel.findOneAndDelete(filter);
  return user;
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    removeUser
}