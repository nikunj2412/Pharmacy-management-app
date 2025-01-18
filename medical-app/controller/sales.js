const { salesService } = require('../service')
const {catchAsync} = require("../utils/catchAsync")

const createSales = catchAsync(async (req, res) => {
    const { body } = req;
    const sales = await salesService.createSales(body);
    return res.send({ results: sales });
});

const get = async (req, res) => {
  const { salesId } = req.params;
  const filter = {
    _id: salesId,
  };
  const sales = await salesService.getSalesById(filter);
  return res.send({ results: sales });
};

const getSalesByUserId = async (req, res) => {
    const { userId } = req.params;
    const sales = await salesService.getSalesByUserId(userId);
    return res.send({ results: sales });
};

const update = catchAsync(async (req, res) => {
  const { body } = req;
  const { salesId } = req.params;
  const filter = {
    _id: salesId,
  };
  const updatedsales = await salesService.updateSales(filter, body);
  return res.send({ results: updatedsales });
});

const removeSales = catchAsync(async (req, res) => {
    const { salesId } = req.params;
    const filter = {
      _id: salesId,
    };
    const sales = await salesService.removeSales(filter);
    return res.send({ results: sales });
});


module.exports = {
    createSales,
    getSalesByUserId,
    update,
    removeSales,
    get
}