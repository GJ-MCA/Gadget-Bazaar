const mongoose = require('mongoose');
const { Schema } = mongoose;

const productReviewSchema = new Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  msg: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
  },
  is_approved:{
    type: Boolean,
    required: false,
    default: false
  },
  created_date:{
    type: Date,
    required: false,
    default: Date.now()
  }
},
{ 
  toJSON: { getters: true },
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

module.exports = mongoose.model('Product_Review',productReviewSchema)