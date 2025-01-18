const { adminService, tokenService } = require('../service')
const {catchAsync} = require("../utils/catchAsync")

const getAllUser = async (req, res) => {
    const user = await adminService.getAllUser();
    return res.send({ results: user });
};

const getAllSales = async (req, res) => {
  const sales = await adminService.getAllSales();
  return res.send({ results: sales });
};

const getAllMedicine = async (req, res) => {
  const medicine = await adminService.getAllMedicine();
  return res.send({ results: medicine });
};

const create = catchAsync(async (req, res) => {
  const { body } = req;
  const admin = await adminService.createAdmin(body);
  return res.send({ results: admin });
});

const login = catchAsync(async(req, res) => {
  const body = req.body;
  const user = await adminService.adminLogin(body);
  const token = await tokenService.generateAuthTokens(user);
  return res.send({ results: {user, token} })
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await adminService.refreshAuth(req.body.refreshToken);
  res.send({ results: { ...tokens } });
});

const logout = catchAsync(async (req, res) => {
  await tokenService.invalidateToken(req.body);
  res.send({ results: { success: true } });
});

module.exports = {
  getAllUser,
  create,
  login, 
  refreshTokens, 
  logout,
  getAllMedicine,
  getAllSales
}