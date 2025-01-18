const userRoutes =  require('./user');
const express = require('express')
const adminRoutes =  require('./admin');

const router = express.Router();
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;