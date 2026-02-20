const mongoose = require('mongoose');

const cptDataSchema = new mongoose.Schema(
  {
    specialty: { type: String, required: true },
    cptCode: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, index: true },
    county: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true, index: true },
    avgCharge: { type: Number, required: true },
    minCharge: { type: Number, required: true },
    maxCharge: { type: Number, required: true },
    reserveAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

cptDataSchema.index({ cptCode: 'text', description: 'text' });

module.exports = mongoose.model('CPTData', cptDataSchema);
