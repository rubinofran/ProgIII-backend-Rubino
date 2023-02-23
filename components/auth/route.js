const { Router } = require('express')
const createToken = require('../../utils/create-token')
const router = new Router()

router.post('/token', crearTokenDeUsuario)

async function crearTokenDeUsuario(req, res, next) {

  if (!req.body.userName) {
    req.logger.verbose('Parámetro userName faltante. Enviando 400 al cliente')
    return res.status(400).end()
  }

  req.logger.info(`Creando token de usuario para ${req.body.userName}`)

  if (!req.body.password) {
    req.logger.info('Parámetro password faltante. Enviando 400 al cliente')
    return res.status(400).end()
  }

  try {
    
    const usuario = await req.model('UsuarioPruebas').findOne({ userName: req.body.userName }, '+password')

    if (!usuario) {
      req.logger.verbose('Usuario no encontrado. Enviando 404 al cliente')
      return res.status(401).end()
    }

    req.logger.verbose('Revisando el password de usuario')
    const result = await usuario.checkPassword(req.body.password)

    delete usuario.password

    if (!result.isOk) {
      req.logger.verbose('Password inválido. Enviando 401 al cliente')
      return res.status(401).end()
    }
    
    const response = await createToken(req, usuario)
    res.status(201).json(response)
  
  } catch (err) {
    next(err)
  }

}


module.exports = router
