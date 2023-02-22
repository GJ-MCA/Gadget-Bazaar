const mongoose = require('mongoose');
const { Schema } = mongoose;

const shoppingSessionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total:  {
    type: Number,
    get: function(value) {
      return value.toFixed(2);
    },
    set: function(value) {
      return parseFloat(value);
    }
  },
  cart_items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart_Item',
  }],
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

module.exports = mongoose.model('Shopping_Session',shoppingSessionSchema)