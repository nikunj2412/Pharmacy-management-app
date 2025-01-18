const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const createMedicine = {
    body: Joi.object().keys({
      name: Joi.string(),
      Quantity: Joi.number(),
      price: Joi.number(),
      accualPrice: Joi.number(),
      expiry: Joi.date()
    }),
};

const getMedicine = {
    params: Joi.object().keys({
        medicineId: Joi.objectId().required(),
    })
  }

const updateMedicine = {
  params: Joi.object().keys({
    medicineId: Joi.objectId().required(),
  })
}

const deleteMedicineById = {
  params: Joi.object().keys({
    medicineId: Joi.objectId().required(),
  }),
};

module.exports = {createMedicine, getMedicine,  updateMedicine, deleteMedicineById}