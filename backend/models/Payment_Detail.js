const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailSchema = new Schema({
  payment_order_id: {
    type: Number,
    required: true
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order_Details',
    required: true
  },
  amount: {
      type: Number,
      get: v => (v/100).toFixed(2),
      set: v => v*100
  },
  payment_method: {
      type: String
  },
  status: {
      type: String,
      default: 'Pending'
  },
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

module.exports = mongoose.model('Payment_Detail',paymentDetailSchema)