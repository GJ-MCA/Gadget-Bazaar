const mongoose = require('mongoose');
const ShippingMethod = require("./ShippingMethod");
const { Schema } = mongoose;

const orderDetailSchema = new Schema({
  order_reference_code: {
    type: String,
    default: null
  },
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
    default: async function() {
      const defaultShippingMethod = await ShippingMethod.findOne({shipping_method: 'Standard'});
      return defaultShippingMethod ? defaultShippingMethod._id : null;
    }
  },
  shipping_charge: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100,
    default: 40
  },
  order_status: {
      type: String,
      enum: ['pending', 'shipped', 'outfordelivery', 'delivered'],
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
  },
  payment_status:
  {
    type: String,
    enum: ['N/A','pending','paid'],
    default: 'pending'
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