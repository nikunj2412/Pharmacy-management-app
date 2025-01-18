const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const createSales = {
  body: Joi.object().keys({
    totalPrice: Joi.number().required(),
    medicines: Joi.array()
      .items(
        Joi.object().keys({
          medicineId: Joi.objectId().required(),
          Quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().required(),
        })
      )
      .min(1)
      .required(),
    userId: Joi.objectId().required(),
    date: Joi.date().required(),
    status: Joi.boolean().required()
  }),
};

const getSalesByUserId = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

const getSales = {
    params: Joi.object().keys({
        salesId: Joi.objectId().required(),
    })
  }

const updateSales = {
  params: Joi.object().keys({
    salesId: Joi.objectId().required(),
  })
};

const deleteSalesById = {
  params: Joi.object().keys({
    salesId: Joi.objectId().required(),
  }),
};

module.exports = {
  createSales,
  getSalesByUserId,
  updateSales,
  deleteSalesById,
  getSales,
};
