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
      !req.user.role /* || true */
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
  
/*   req.hasPermission = function hasPermission(permissionId) {
    if (!req.user || !req.user.role) {
      return false
    }

    if (req.user.role === 'admin') {
      return true
    }

    if (!req.user.permissions || !req.user.permissions.length) {
      return false
    }

    if (!req.user.permissions.find((id) => id === permissionId)) {
      return false
    }

    return true
  }

  req.isAdmin = function isAdmin() {
    return req.user && req.user.role === 'admin'
  } */

  req.isAuthenticated = function isAuthenticated() {
    return !!req.user
  }

  return next(null)
}

module.exports = {
  authentication: authenticationMiddleware,
  authorization: authorizationMiddleware
}