const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderDetailsSchema = new Schema({
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
  payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true
  },
  shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
  },
  billing_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
  },
  order_status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered'],
      default: 'pending'
  },
  order_date: {
      type: Date,
      default: Date.now
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

module.exports = mongoose.model('Order_Details',orderDetailsSchema)