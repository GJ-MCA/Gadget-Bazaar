const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order_Details',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    default: 0,
    get: function(value) {
      return value.toFixed(2);
    },
    set: function(value) {
      return parseFloat(value);
    }
  },
  order_details_status: {
      type: String,
      enum: ['pending', 'shipped', 'outfordelivery', 'delivered'],
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

module.exports = mongoose.model('Order_Item',orderItemSchema)