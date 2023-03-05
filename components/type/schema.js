const mongoose = require('mongoose')

const { Schema } = mongoose

const typeSchema = new Schema({
    typeName: { 
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

module.exports = typeSchema