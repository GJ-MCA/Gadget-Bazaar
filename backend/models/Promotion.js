const mongoose = require('mongoose');
const { Schema } = mongoose;


const promotionSchema = new Schema({
  promotion_name: {
    type: String,
    required: true
  },
  coupon_code: {
    type: String,
    unique: true,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  times_used: {
    type: Number,
    default: 0
  },
  times_remaining: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    default: 'Active'
  },
  expiry_date: {
    type: Date,
    required: true
  }
}, { 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});


module.exports = mongoose.model('Promotion',promotionSchema)