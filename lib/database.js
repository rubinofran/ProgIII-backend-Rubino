const { Mongoose } = require('mongoose')
// const mongoosePaginate = require("mongoose-paginate");
// const mongooseTimestamp = require("mongoose-cu-timestamps");
const { schemas } = require('../components')

class Database {
  constructor(config, logger) {
    this.config = config
    this.logger = logger.child({ context: 'Database' })
    this.logger.verbose('Creando instancia de mongoose')
    this.mongoose = new Mongoose()
    this.logger.verbose('Instancia de mongoose creada')

    this._setupMongoosePlugins()
    this._setupMongooseModels()
  }

  async connect() {
    this.logger.verbose('Conectando a la base de datos')

    const options = {
      maxPoolSize: 25,
    }

    // if (this.config.mongo.certificate) {
    //   options.ssl = true
    //   options.sslCert = this.config.mongo.certificate
    //   options.sslKey = this.config.mongo.certificate
    // }

    await this.mongoose.connect(this.config.mongo.url, options)

    // Views can be created once the connection is established
    // await this._setupMongoViews()

    this.logger.verbose('Conecxón a la base de datos')
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

  _setupMongoosePlugins() {
    this.logger.verbose('Adjuntando plugins')
    // mongoosePaginate.paginate.options = { lean: true };
    // this.mongoose.plugin(mongoosePaginate);
    // this.mongoose.plugin(mongooseTimestamp);
    this.logger.verbose('Plugins adjuntos')
  }

  _setupMongooseModels() {
    this.logger.verbose('Registrando modelos')

    // this.mongoose.model("Institution", schemas.institution);
    /* this.mongoose.model('Role', schemas.role) COMENTADO POR MI */
    this.mongoose.model('User', schemas.user) 

    this.logger.verbose('Modelos registrados')
  }
}

module.exports = Database
