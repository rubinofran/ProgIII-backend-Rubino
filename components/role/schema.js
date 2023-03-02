const mongoose = require('mongoose')

const { Schema } = mongoose

const roleSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true, 
  },
  createdAt: { 
    type: String,
    required: true, 
  }, 
})

module.exports = roleSchema
