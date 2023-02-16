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

module.exports = mongoose.model('product_review',productReviewSchema)