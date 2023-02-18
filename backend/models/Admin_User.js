const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminUserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  date_created: {
    type: Date, 
    default: Date.now 
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  super_admin:{
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Admin_User',adminUserSchema)