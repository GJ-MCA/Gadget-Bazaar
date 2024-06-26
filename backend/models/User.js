const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: false
  },
  date_created: {
    type: Date, 
    default: Date.now 
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  mobile_otp: {
    type: String,
    required: false,
    default: ""
  },
  is_mobile_verified: {
    type: Boolean,
    required: false,
    default: false
  },
  email_otp: {
    type: String,
    required: false,
    default: ""
  },
  is_email_verified: {
    type: Boolean,
    required: false,
    default: false
  },
},
{ 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});
userSchema.index({ mobile_otp: 1 }, { expireAfterSeconds: 300 });
userSchema.index({ email_otp: 1 }, { expireAfterSeconds: 300 });
module.exports = mongoose.model('User',userSchema)