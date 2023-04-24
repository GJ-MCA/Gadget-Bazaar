const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderDetailSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
      type: Number,
      get: v => (v/100).toFixed(2),
      set: v => v*100
  },
  shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
  },
  billing_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
  },
  shipping_method: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipping_Methods',
    default: 'Standard'
  },
  shipping_charge: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100,
    default: 40
  },
  order_status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending'
  },
  order_date: {
      type: Date,
      default: Date.now
  },
  order_time: {
    type: String,
    default: () => new Date().toLocaleTimeString()
  },
  coupon_code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion'
  }
},
{ 
    toJSON: { getters: true }
},
{
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

module.exports = mongoose.model('Order_Detail',orderDetailSchema)