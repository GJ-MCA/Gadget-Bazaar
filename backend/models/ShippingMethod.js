const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingMethodSchema = new Schema({
  shipping_method: {
    type: String,
    unique: true,
    required: true
  },
  shipping_charge: {
    type: Number,
    get: function(value) {
      return value.toFixed(2);
    },
    set: function(value) {
      return parseFloat(value);
    }
  },
  status: {
      type: String,
      default: 'Inactive'
  },
},
{ 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

module.exports = mongoose.model('Shipping_Methods',shippingMethodSchema)