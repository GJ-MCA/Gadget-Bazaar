const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemDetailsSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    cart_item_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart_Item_Details',
    },
    quantity: {
        type: Number,
        required: true
    },
    item_total: {
        type: Number,
        required: true,
        get: v => (v/100).toFixed(2),
        set: v => v*100
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

module.exports = mongoose.model('Cart_Item_Details',cartItemDetailsSchema)