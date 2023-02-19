const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shopping_Session',
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