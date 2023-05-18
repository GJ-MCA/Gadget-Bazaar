const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shipping_charge: {
    type: Number,
    default: 0,
    get: v => (v/100).toFixed(2),
    set: v => v*100
  },
  total: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100
  },
  coupon_code: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion'
  },
  discounted_total:{
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100,
    default: null
  }
},
{ 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

module.exports = mongoose.model('Cart_Item',cartItemSchema)