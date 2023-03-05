const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const transactionSchema = new Schema({
    transactionType: { 
        type: ObjectId, 
        ref: 'Type', 
        required: true,
    },
    userId: { 
        type: String, 
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: { 
        type: String,
        required: true, 
    }, 
})

module.exports = transactionSchema