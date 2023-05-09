const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Brand',brandSchema)