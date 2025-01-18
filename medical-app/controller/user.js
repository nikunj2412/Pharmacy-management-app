const { userService, tokenService } = require('../service')
const {catchAsync} = require("../utils/catchAsync")

const create = catchAsync(async (req, res) => {
    const { body } = req;
    const user = await userService.createUser(body);
    return res.send({ results: user });
});

const get = async (req, res) => {
    const { userId } = req.params;
    const filter = {
      _id: userId,
    };
    const user = await userService.getUserById(filter);
    return res.send({ results: user });
};

// const login = catchAsync(async(req, res) => {
//   const body = req.body;
//   const user = await userService.login(body);
//   const token = await tokenService.generateAuthTokens(user);
//   return res.send({ results: {user, token} })
// });

const update = catchAsync(async (req, res) => {
  const { body } = req;
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const updatedUser = await userService.updateUser(filter, body);
  return res.send({ results: updatedUser });
});

const remove = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const user = await userService.removeUser(filter);
  return res.send({ results: user });
});

module.exports = {create, get, update, remove}