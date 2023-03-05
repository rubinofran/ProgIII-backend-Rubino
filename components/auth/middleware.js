const jwt = require('jsonwebtoken')
const createError = require('http-errors')

function getToken(req, next) {
  const TOKEN_REGEX = /^\s*Bearer\s+(\S+)/g
  const matches = TOKEN_REGEX.exec(req.headers.authorization)
  if (!matches) {
    return next(new createError.Unauthorized())
  }
  const [, token] = matches
  return token
}

function authenticationMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    req.logger.warn('Falta encabezado de autorización')
    return next(new createError.Unauthorized())
  }
  const token = getToken(req, next)
  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY)
    /* console.log(req.user) */
    if (
      !req.user ||
      !req.user._id ||
      !req.user.role /* || true // to test authentication */
    ) {
      req.logger.error('Error al autenticar')
      return next(new createError.Unauthorized())
    }

    req.logger.verbose(`Usuario ${req.user._id} autenticado`)
    return next()
  } catch (err) {
/*     if (err.message === 'invalid algorithm' || err.message === 'invalid signature') {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      // req.logger.error(`Intento de acceso sospechoso desde la ip=${ip} ${token}`)
    } */
/*     if (err.name === 'TokenExpiredError') {
      // req.logger.warn('El token expiró, enviando 401 al cliente')
      return res.sendStatus(401)
    } */
    return next(new createError.Unauthorized(err))
  }
}

function authorizationMiddleware(req, res, next) {
  
  req.logger.verbose('Método evaluado para la autorización: ', req.method)
  req.logger.verbose('URL evaluada para la autorización: ', req.url)
  const isUserRoute = req.url.includes('userRoute') 
  const isTransactionRoute = req.url.includes('transactionRoute') 

  if(!req.user) { 
    req.logger.error('Error al autorizar, debe ser un usuario válido')
    return next(new createError.Unauthorized())
  }
  console.log('---------------> Supera autorización de usuario')

  if(!req.user.role) { 
    req.logger.error('Error al autorizar, el usuario debe tener un rol')
    return next(new createError.Unauthorized())
  }
  console.log('---------------> Supera autorización de rol')

  if (req.user.role != 'admin' && req.user.role != 'user') {
  // if(req.user.role != 'another') { // to test authoraization
    req.logger.error('Error al autorizar, rol inválido')
    return next(new createError.Unauthorized())
  }
  console.log('---------------> Supera autorización de tipo de rol')
  
  switch (req.method) {

    case 'DELETE':
      if(req.user.role === 'user' && (isUserRoute || isTransactionRoute)) {
        req.logger.error('Error al autorizar, rol inválido para eliminar usuarios o transacciones')
        return next(new createError.Unauthorized())
      }
      break;
    
    // Waiting for update 
    case 'GET':
    case 'PUT':
    case 'POST':
    default:
      console.log('---------------> Supera la autorización dentro del selector de método')
      req.logger.verbose(`Usuario ${req.user._id} autorizado`)
      return next()
  }

  console.log('---------------> Supera la autorización fuera del selector de método') 
  req.logger.verbose(`Usuario ${req.user._id} autorizado`)
  return next()
}

module.exports = {
  authentication: authenticationMiddleware,
  authorization: authorizationMiddleware
}