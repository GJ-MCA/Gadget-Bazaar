const mongoose = require('mongoose');

const forgotPasswordTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // expires in 1 hour
  }
},
{ 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

const ForgotPasswordToken = mongoose.model('ForgotPasswordToken', forgotPasswordTokenSchema);
module.exports = ForgotPasswordToken;
