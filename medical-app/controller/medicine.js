const { medicineService } = require('../service')
const {catchAsync} = require("../utils/catchAsync")

const create = catchAsync(async (req, res) => {
    const { body } = req;
    const medicine = await medicineService.createMedicine(body);
    return res.send({ results: medicine });
});

const get = async (req, res) => {
    const { medicineId } = req.params;
    const filter = {
      _id: medicineId,
    };
    const medicine = await medicineService.getMedicineById(filter);
    return res.send({ results: medicine });
};

const update = catchAsync(async (req, res) => {
  const { body } = req;
  const { medicineId } = req.params;
  const filter = {
    _id: medicineId,
  };
  const updatedMedicine = await medicineService.updateMedicine(filter, body);
  return res.send({ results: updatedMedicine });
});

const remove = catchAsync(async (req, res) => {
  const { medicineId } = req.params;
  const filter = {
    _id: medicineId,
  };
  const medicine = await medicineService.removeMedicine(filter);
  return res.send({ results: medicine });
});

module.exports = {create, get, update, remove}