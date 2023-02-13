const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

// const { ObjectId } = Schema.Types COMENTADO POR MI

const usuarioPruebasSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String,
    required: true, 
    select: true /* con este valor en false, no se puede ver la contraseña mediante un get*/
  },
})

usuarioPruebasSchema.method('checkPassword', async function checkPassword(potentialPassword) {
  if (!potentialPassword) {
    return Promise.reject(new Error('Password is required'))
  }

  const isMatch = await bcrypt.compare(potentialPassword, this.password)

  return { isOk: isMatch }
})

module.exports = usuarioPruebasSchema