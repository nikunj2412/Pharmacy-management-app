const { userModel, adminModel, medicineModel, salesModel } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const bcrypt = require("bcrypt");
const tokenService = require('./token')
const userService = require('./user')


async function getAllUser() {
    const user = await userModel.find();
    return user;
}

async function getAllSales() {
    const sales = await salesModel
        .find()
        .populate('userId', 'firstName lastName email') // Fetch user details (firstName, lastName, email)
        .populate('medicines.medicineId', 'name price'); // Fetch medicine details (name, price)

    return sales;
}


async function getAllMedicine() {
    const medicine = await medicineModel.find();
    return medicine;
}

async function createAdmin(body) {
    const admin = await adminModel.create(body);
    return admin;
}

async function adminLogin(body) {
    const { email, password, isAdmin } = body;

    if (!email || !password) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');
    }

    const admin = await adminModel.findOne({ email });

    if (!admin) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email');
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
        if(isAdmin){
            return admin;
        }
        else {
            throw new ApiError(httpStatus.BAD_REQUEST, 'User is not Admin');
        }
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Password');
    }
}

const refreshAuth = async (refreshToken) => {
    try {
      const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
      const user = await userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Token');
      }
      await refreshTokenDoc.remove();
      return tokenService.generateAuthTokens(user);
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
};

module.exports = {
    getAllUser,
    createAdmin,
    getAllSales,
    adminLogin,
    refreshAuth,
    getAllMedicine
}