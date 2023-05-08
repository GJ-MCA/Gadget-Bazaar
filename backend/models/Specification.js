const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    is_active: {
      type: Boolean,
      default: true
    }
  });
module.exports = mongoose.model('Specification',specificationSchema)