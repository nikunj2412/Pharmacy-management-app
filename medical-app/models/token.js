const mongoose = require('mongoose');
const enumModel = require('./enum');
const toJSON = require('./plugins/toJSON.plugin')

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(enumModel.EnumTypeOfToken),
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);
module.exports = Token;
