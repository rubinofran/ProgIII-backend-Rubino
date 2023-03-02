const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const Schema = mongoose.Schema
const { ObjectId } = Schema.Types
const emailValidator = validate({ validator: 'isEmail' })

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidator,
  },
  password: { 
    type: String,
    required: true, 
  },
  clientType: {
    type: String,
  },
  name: {
    type: String, /* firstName + lastName | businessName */
    required: true, 
  },
  address: {
    type: String,
  },
  accountType: {
    type: String,
  },
/*   cbu: { 
    type: Number,
    unique: true,
  }, */
  alias: {
    type: String,
    unique: true,
  },
  moneyInAccount: {
    type: Number,
  },
  isActive: { 
    type: Boolean,
    required: true,  
  },
  role: { 
    type: ObjectId, 
    ref: 'Role', 
    required: true 
  },
  createdAt: { 
    type: String,
    required: true, 
  },
  updatedAt: {
    type: String,
    required: true, 
  },
})

module.exports = userSchema
