const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  { 
    toJSON: { getters: true },
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    }
});
module.exports = mongoose.model('Specification',specificationSchema)