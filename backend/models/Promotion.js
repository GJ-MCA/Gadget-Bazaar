const mongoose = require('mongoose');
const { Schema } = mongoose;

const promotionSchema = new Schema({
  promotion_name: {
    type: String,
    required: true
  },
  coupon_code: {
    type: String,
    unique: true,
    required: true
  },
  status: {
      type: String,
      default: 'Active'
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

module.exports = mongoose.model('Promotion',promotionSchema)