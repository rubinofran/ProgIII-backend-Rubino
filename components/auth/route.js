const { Router } = require('express')
const createToken = require('../../utils/create-token')
const bcrypt = require('bcrypt')

const router = new Router()

router.post('/token', validateUserAndCreateToken)

async function validateUserAndCreateToken(req, res, next) {
  console.log('validateUserAndCreateToken: ', req.body)

  if (!req.body.userName) {
    req.logger.verbose('Parámetro userName faltante. Enviando 400 al cliente')
    res.status(400).send('Parámetro userName faltante')
  }
  
  req.logger.info(`Intentando crear token de usuario para ${req.body.userName}`)

  if (!req.body.password) {
    req.logger.info('Parámetro password faltante. Enviando 400 al cliente')
    res.status(400).send('Parámetro password faltante')
  }

  try {
      const user = await req.model('User').findOne({ userName: req.body.userName }, '+password')
      const passwordCorrect = user == null
          ? false
          : await bcrypt.compare(req.body.password, user.password)

      if (!(user && passwordCorrect)) {
          req.logger.verbose('Usuario o contraseña inválidos. Enviando 401 al cliente')
          res.status(401).send('Usuario o contraseña inválidos')
      }
      
      const response = await createToken(req, user)
      res.status(201).send(response)
  } catch (err) {
      next(err)
  }
}

module.exports = router
