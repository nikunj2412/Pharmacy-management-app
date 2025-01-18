const express = require('express')
const { userValidation } = require('../validation');
const auth = require('../middleware/auth')
const { userController } = require('../controller');
const validate = require('../middleware/validate');

const router = express.Router();

router
  .route('/')
  /**
   * createUser
   * */
  .post(validate(userValidation.createUser), userController.create)

router
  .route('/update/:userId')
  /**
   * updateUser
   * */
  .put(
  validate(userValidation.updateUser), 
  userController.update)

router.route('/delete/:userId')
  /**
   * deleteUser
   */
  .delete(validate(userValidation.deleteUserById), userController.remove);

module.exports = router;