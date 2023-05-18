const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address_line_1: {
    type: String,
    required: true
  },
  address_line_2: {
    type: String,
    default: ''
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
    type: String
  },
},
{ 
    toJSON: { getters: true },
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
});

module.exports = mongoose.model('Address', addressSchema);