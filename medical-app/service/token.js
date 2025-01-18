const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');
const httpStatus = require('http-status');
const { userModel, tokenModel } = require('../models');
const ApiError = require('../utils/ApiError');
const { userService } = require('../service')
require("dotenv").config();


const JWT_SECRET = process.env.PASSPORT_SECRET_KEY;
const resetPasswordExpirationMinutes = process.env.RESET_PASSWORD_EXPIRATION_MINUTES;
const resetPasswordCodeSize = process.env.RESET_PASSWORD_CODE_SIZE;
const accessExpirationMinutes = process.env.ACCESS_EXPIRATION_MINUTES;
const refreshExpirationDays = process.env.REFRESH_EXPIRATION_DAYS;

const generateToken = (userId, expires, secret = JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await tokenModel.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
  const tokenDoc = await tokenModel.findOne({ token, type, user: payload.sub });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Token');
  }
  return tokenDoc;
};

const verifyCode = async (verificationRequest) => {
  const { code: token, type, email } = verificationRequest;
  const userObj = await userService.getOne({ email });
  if (!userObj) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No such User');
  }
  const tokenDoc = await tokenModel.findOne({ token, type, user: userObj._id });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incorrect code');
  }
  return tokenDoc;
};

const generateCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  ).join('');
};
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateCode(resetPasswordCodeSize);
  await tokenModel.deleteMany({ user, type: 'resetPassword' });
  await saveToken(resetPasswordToken, user.id, expires, 'resetPassword');
  return resetPasswordToken;
};


const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);
  const refreshTokenExpires = moment().add(refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires);
  await saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const getAuthTokens = async (user, token) => {
  const tokenDoc = await tokenModel.findOne({ type: 'refresh', user: user.id });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  const { exp } = jwt.verify(token, JWT_SECRET);
  return {
    access: {
      token,
      expires: moment.unix(exp).toDate(),
    },
    refresh: {
      token: tokenDoc.token,
      expires: tokenDoc.expires,
    },
  };
};
/**
 * @returns {Promise<*>}
 * @param {Object}  invalidReq
 */
const invalidateToken = async (invalidReq) => {
  const { refreshToken: token } = invalidReq;
  const tokenDoc = await tokenModel.findOne({ type: 'refresh', token });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token not found');
  } else {
    return tokenModel.findByIdAndDelete(tokenDoc._id);
  }
};

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    verifyCode,
    generateResetPasswordToken,
    generateAuthTokens,
    getAuthTokens,
    invalidateToken
}
