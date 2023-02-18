const mongoose = require('mongoose');
const { Schema } = mongoose;

const shoppingSessionSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  total: {
    type: Number,
    get: v => (v/100).toFixed(2),
    set: v => v*100
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

module.exports = mongoose.model('Shopping_Session',shoppingSessionSchema)