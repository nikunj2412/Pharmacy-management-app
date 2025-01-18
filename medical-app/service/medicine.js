const { medicineModel } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

async function createMedicine(body) {
    const medicine = await medicineModel.create(body);
    return medicine;
}

async function getMedicineById(id) {
    const medicine = await medicineModel.findById(id);
    return medicine;
}

async function getOne(query) {
  const medicine = await medicineModel.findOne(query);
  return medicine;
}

async function updateMedicine(filter, body) {
  const medicineData = await getOne(filter);
  if (!medicineData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'medicine not found');
  }
  const medicine = await medicineModel.findOneAndUpdate(filter, body, { new: true });
  return medicine;
}

async function removeMedicine(filter) {
  const medicine = await medicineModel.findOneAndDelete(filter);
  return medicine;
}

module.exports = {
    createMedicine,
    getMedicineById,
    updateMedicine,
    removeMedicine
}