const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payment_order_id: {
    type: String,
    unique: true,
    required: true
  },
  payment_date_time:{
    type: Date,
    default: Date.now(),
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order_Details',
    required: true
  },
  payment_method: {
      type: String,
      default: 'Card'
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