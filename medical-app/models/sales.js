const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const salesSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
    },
    date: {
      type: Date,
    },
    salesNumber: {
      type: Number,
    },
    medicines: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'medicine',
          required: true,
        },
        Quantity: {
          type: Number,
          required: true,
          default: 1, // Default to 1 if not specified
        },
        price: {
          type: Number, // Optional: Price of the medicine (if needed)
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false, // Default to "Unpaid" (false)
    },
  },
  { timestamps: true }
);

salesSchema.plugin(toJSON);

const salesModel = mongoose.model('sales', salesSchema);

module.exports = salesModel;
