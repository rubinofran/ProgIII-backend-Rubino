const { Mongoose } = require('mongoose')
const { schemas } = require('../components')

class Database {
  constructor(config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'Database' })
    this.logger.verbose('Creando instancia de mongoose')
    this.mongoose = new Mongoose()
    this.logger.verbose('Instancia de mongoose creada')
    this._setupMongooseModels()
  }

  async connect() {
    this.logger.verbose('Conectando a la base de datos')

    const options = {
      maxPoolSize: 25,
    }

    await this.mongoose.connect(this.config.mongo.url, options)
    this.logger.verbose('Conexión a la base de datos')
  }

  async disconnect() {
    this.logger.verbose('Desconectando de la base de datos')
    await this.mongoose.disconnect()
    this.logger.verbose('Desconectado de la base de datos')
  }

  model(...args) {
    return this.mongoose.model(...args)
  }

  async ping() {
    if (!this.mongoose.connection.db) {
      return Promise.reject(new Error('No se pudo conectar a la base de datos'))
    }
    return this.mongoose.connection.db.admin().ping()
  }

  _setupMongooseModels() {
    this.logger.verbose('Registrando modelos')

    this.mongoose.model('Role', schemas.role)
    this.mongoose.model('User', schemas.user)
    this.mongoose.model('Type', schemas.type)
    this.mongoose.model('Transaction', schemas.transaction)

    this.logger.verbose('Modelos registrados')
  }
}

module.exports = Database
