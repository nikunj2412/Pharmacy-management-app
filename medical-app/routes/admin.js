const express = require('express')
const { adminValidation, userValidation, medicineValidation, salesValidation } = require('../validation');
const auth = require('../middleware/auth')
const { adminController, userController, medicineController, salesController } = require('../controller');
const validate = require('../middleware/validate');

const router = express.Router();

/**
   * User Apis
   * */



router
  .route('/createUser')
  /**
   * createUser
   * */
  .post(validate(userValidation.createUser), userController.create)

  router
  .route('/getUser/:userId')
  /**
   * GetUserById
   * */
  .get(validate(userValidation.getUser), userController.get)

  router
  .route('/updateUser/:userId')
  /**
   * updateUser
   * */
  .put(
  validate(userValidation.updateUser), 
  userController.update)

router.route('/deleteUser/:userId')
  /**
   * deleteUser
   */
  .delete(validate(userValidation.deleteUserById), userController.remove);



  /**
   * Medicine Apis
   * */




router
  .route('/createMedicine')
  /**
   * createMedicine
   * */
  .post(validate(medicineValidation.createMedicine), medicineController.create)

router
  .route('/getMedicine/:medicineId')
  /**
   * GetMedicineById
   * */
  .get(validate(medicineValidation.getMedicine), medicineController.get)

router
  .route('/updateMedicine/:medicineId')
  /**
   * updateMedicine
   * */
  .put(
  validate(medicineValidation.updateMedicine), 
  medicineController.update)

router.route('/deleteMedicine/:medicineId')
  /**
   * deleteMedidine
   */
  .delete(validate(medicineValidation.deleteMedicineById), medicineController.remove);



/**
   * Sales Apis
   * */

router
  .route('/createSales')
  /**
   * createSales
   * */
  .post(validate(salesValidation.createSales), salesController.createSales)

router
  .route('/getSales/:salesId')
  /**
   * GetSalesById
   * */
  .get(validate(salesValidation.getSales), salesController.get)

router
  .route('/getSalesByUserId/:userId')
  /**
   * getSalesByUserId
   * */
  .get(validate(salesValidation.getSalesByUserId), salesController.getSalesByUserId)

router
  .route('/updateSales/:salesId')
  /**
   * updatesales
   * */
  .put(
  validate(salesValidation.updateSales), 
  salesController.update)

router
  .route('/deleteSalesById/:salesId')
  /**
   * deleteSalesById
   * */
  .delete(validate(salesValidation.deleteSalesById), salesController.removeSales)



  
/**
   * Admin Apis
   * */



router
  .route('/')
  /**
   * createAdmin
   * */
  .post(validate(adminValidation.createAdmin), adminController.create)

router
  .route('/login')
  /**
   * login
   */
  .post(validate(adminValidation.login), adminController.login)

router
  .route('/getAllUsers')
  /**
   * getAllUsers
   * */
  .get(validate(adminValidation.getAllUser), adminController.getAllUser)


router
  .route('/getAllSales')
  /**
   * getAllSales
   * */
  .get(validate(adminValidation.getAllSales), adminController.getAllSales)


router
  .route('/getAllMedicine')
  /**
   * getAllMedicine
   * */
  .get(validate(adminValidation.getAllMedicine), adminController.getAllMedicine)


router
  .route('/refresh-tokens')
  /**
   * refreshtoken
   * */

  .post(validate(adminValidation.refreshTokens),adminController.refreshTokens)

router
  .route('/logout')
  
  .post(auth(), validate(adminValidation.logout), adminController.logout);

module.exports = router;