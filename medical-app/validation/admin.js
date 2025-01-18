const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const login = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string(),
    isAdmin: Joi.bool()
  }),
};

const createAdmin = {
  body: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
};

const getAllUser = {};

const getAllMedicine = {};

const getAllSales = {};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  login, 
  createAdmin,
  getAllUser,
  refreshTokens,
  logout,
  getAllMedicine,
  getAllSales
}