const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const createUser = {
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      mobileNumber: Joi.string()
    }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  })
}

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  })
}

const deleteUserById = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

module.exports = {createUser, getUser, updateUser, deleteUserById}