const mongoose = require('mongoose')
const validate = require('mongoose-validator')

const Schema = mongoose.Schema
// const { ObjectId } = Schema.Types COMENTADO POR MI
const emailValidator = validate({ validator: 'isEmail' })

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: emailValidator,
  },
  password: { type: String, select: false },
  name: {
    firstName: { type: String },
    lastName: { type: String },
  },
  // role: { type: ObjectId, ref: 'Role', required: true }, COMENTADO POR MI
  // bornDate: { type: Date }, COMENTADO POR MI
  isActive: { type: Boolean },
})

module.exports = userSchema
