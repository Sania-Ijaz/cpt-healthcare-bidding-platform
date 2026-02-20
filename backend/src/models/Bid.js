const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cptDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CPTData',
      required: true,
    },
    bidAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },
    adminComments: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);
