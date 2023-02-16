const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailsSchema = new Schema({
  payment_order_id: {
    type: Number,
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
      type: String
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

module.exports = mongoose.model('payment_details',paymentDetailsSchema)