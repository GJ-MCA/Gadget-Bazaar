const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  pincode: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
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

module.exports = mongoose.model('Address', addressSchema);