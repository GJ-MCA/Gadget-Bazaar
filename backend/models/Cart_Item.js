const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  shipping_charge: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100
  },
  item_total: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100
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

module.exports = mongoose.model('Cart_Item',cartItemSchema)