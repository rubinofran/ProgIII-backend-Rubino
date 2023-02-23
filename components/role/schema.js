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
    type: Date,
    required: true, 
  },
  updatedAt: {
    type: Date,
    required: true, 
  }
})

module.exports = roleSchema
