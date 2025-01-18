const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON.plugin')

const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    mobileNumber: {
      type: String
    }
});

userSchema.plugin(toJSON);

const userModel = mongoose.model('user',userSchema)
  
module.exports = userModel;