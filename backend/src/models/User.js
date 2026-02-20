const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },
    zipCode: {
      type: String,
      required: true,
      match: [/^\d{5}$/, 'ZIP code must be exactly 5 digits'],
    },
    type: {
      type: String,
      enum: ['patient', 'broker', 'employer'],
      required: true,
    },
    numberOfEmployees: { type: Number },
    planType: {
      type: String,
      enum: ['PPO', 'HMO', 'EPO', 'HDHP', 'Custom'],
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
