const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const toJSON = require('./plugins/toJSON.plugin')

const adminSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {
      type: String,
      private: true,
    },
    mobileNumber: {
      type: String
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
});

adminSchema.plugin(toJSON);
  
adminSchema.pre('save', async function (next) {
    const Admin = this;
    if (Admin.isModified('password')) {
        Admin.password = await bcrypt.hash(Admin.password, 10);
    }
    next();
});
const adminModel = mongoose.model('admin',adminSchema)
  
module.exports = adminModel;