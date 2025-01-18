const mongoose = require('mongoose')
const toJSON = require('./plugins/toJSON.plugin')

const medicineSchema = new mongoose.Schema({
    name: {type: String},
    Quantity: {
      type: Number
    },
    price:{
      type: Number
    },
    accualPrice: {
      type: Number
    },
    expiry:{
      type: Date
    }
});

medicineSchema.plugin(toJSON);

const medicineModel = mongoose.model('medicine',medicineSchema)
  
module.exports = medicineModel;