const http = require('http')
const express = require('express')
const expressBodyParser = require('body-parser')
// const boolParser = require("express-query-boolean");
// const prettyMs = require("pretty-ms");
const onFinished = require('on-finished')
// const helmet = require("helmet");
// const cors = require("cors");
// const rateLimit = require("express-rate-limit");
// const ms = require("ms");
// const addRequestId = require("express-request-id");
const Mongoose = require('mongoose')

/* const { COMENTADO POR MI
  // authentication,
  authorization,
} = require('../components/authentication/middleware') */
const { routers } = require('../components')

class Server {
  constructor(config, logger, database, s3) {
    this.config = config
    this.logger = logger.child({ context: 'Server' })
    this.database = database
    this.s3 = s3

    this.logger.verbose('Creando aplicación express e instancia de servidor HTTP')
    this.app = express()
    this._httpServer = http.createServer(this.app)
    this.logger.verbose('Aplicación Express e instancia de servidor HTTP creadas')

    // Enable if we're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx,
    // etc) see https://expressjs.com/en/guide/behind-proxies.html
    this.app.set('trust proxy', 1)

    this._setupExpressMiddleware()
    this._setupExpressRoutes()
    this._setupErrorHandler()
  }

  async listen() {
    this.logger.verbose('Intentando vincular el servidor HTTP a %s', this.config.server.url)
    /* eslint-disable no-undef */
    this._httpServer.listen(process.env.PORT || 3000, (err) => {
      if (err) {
        return Promise.reject(err)
      }

      this.logger.verbose('Servidor HTTP vinculado')
      return Promise.resolve()
    })
  }

  async close() {
    this._httpServer.close((err) => {
      if (err) {
        return Promise.reject(err)
      }
      return Promise.resolve()
    })
  }

  _setupExpressMiddleware() {
    this.app.request.config = this.config
    this.app.request.s3 = this.s3
    this.app.request.model = (...args) => this.database.model(...args)
    this.app.request.pingDatabase = (...args) => this.database.ping(...args)

    const requestLogger = () => (req, res, next) => {
      req._startTime = Date.now()
      req.logger = this.logger.child({})

      const headers = { ...req.headers }
      // delete headers.authorization;

      req.logger.info('Solicitud entrante', {
        httpVersion: req.httpVersion,
        method: req.method,
        url: req.url,
        trailers: req.trailers,
        requestId: req.id,
        headers,
      })

      onFinished(res, () => {
        req.logger.info('Respuesta saliente', {
          user: req.user ? req.user._id : 'no autenticado',
          httpVersion: req.httpVersion,
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          requestId: req.id,
          // duration: prettyMs(Date.now() - req._startTime),
          duration: Date.now() - req._startTime,
        })
      })

      next(null)
    }

    const requestQuery = () => (req, res, next) => {
      req.select = req.query.select
      req.sort = req.query.sort
      req.populate = req.query.populate
      req.offset = req.query.offset ? parseInt(req.query.offset, 10) : 0
      req.limit = req.query.limit
        ? Math.min(parseInt(req.query.limit, 10), this.config.server.maxResultsLimit)
        : this.config.server.maxResultsLimit

      delete req.query.sort
      delete req.query.offset
      delete req.query.limit
      delete req.query.select
      delete req.query.populate

      next(null)
    }

    this.logger.verbose('Adjuntando middleware a la aplicación express')
    // this.app.use(addRequestId());
    // this.app.use(helmet());
    /* this.app.use(authorization) COMENTADO POR MI */
    // this.app.use(cors());
    // this.app.use(
    // 	rateLimit({
    // 		windowMs: ms(this.config.rateLimit.window),
    // 		max: parseInt(this.config.rateLimit.requests, 10),
    // 	})
    // );
    this.app.use(expressBodyParser.raw())
    this.app.use(expressBodyParser.json({ limit: '50mb' }))
    this.app.use(expressBodyParser.urlencoded({ extended: true }))
    // this.app.use(boolParser());
    this.app.use(requestQuery())
    this.app.use(requestLogger())
    // this.app.use(blockAppVerions)
    this.logger.verbose('Middleware adjunto')
  }

  _setupExpressRoutes() {
    this.logger.verbose('Adjuntando enrutadores de recursos a la aplicación Express')
    this.app.get('/favicon.ico', (req, res) => res.status(204))

    // this.app.use("/auth", routers.authentication);
    // this.app.use("/institutions", authentication, routers.institution);
    
    this.app.use('/', routers.status)
    this.app.use('/users', routers.user)

    this.logger.verbose('Enrutadores de recursos adjuntados')
  }

  _setupErrorHandler() {
    this.logger.verbose('Adjuntando controlador de errores')
    // eslint-disable-next-line no-unused-vars
    this.app.use((err, req, res, next) => {
      if (!err.statusCode) {
        err.statusCode = Server.statusCodeByErrorName[err.name] || 500
      }
      const isMongooseValidationError = err instanceof Mongoose.Error.ValidationError
      if (isMongooseValidationError) {
        req.logger.debug('Error de validación de mongoose', JSON.stringify(err))
        res.status(err.statusCode).json({
          errors: Object.keys(err.errors).map((field) => ({
            field,
            message: err.errors[field].message,
            kind: err.errors[field].kind,
          })),
        })
      } else {
        req.logger.error(err.toString(), err)
        req.logger.verbose('Respondiendo al cliente', err.toString())
        res.status(err.statusCode).send(err.toString())
      }
    })
    this.logger.verbose('Controlador de errores adjunto')
  }
}

Server.statusCodeByErrorName = {
  ValidationError: 400,
  CastError: 400,
  UnauthorizedError: 401,
}

module.exports = Server
