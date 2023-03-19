const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  price: {
    type: Number,
    get: function(value) {
      return value.toFixed(2);
    },
    set: function(value) {
      return parseFloat(value);
    }
  },
  quantity: {
    type: Number,
    default: 1
  },
  image: { type: String, default: null },
  status: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Product',productSchema)