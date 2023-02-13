const mongodb = require('mongodb')
const config = require('config')

const { MongoClient } = mongodb
const { ObjectId } = mongodb

// eslint-disable-next-line
console.log(`Running migrations on DB ${config.mongo.db} for tenant ${config.tenant}\n`)
// this.logger.verbose(`Ejecutando migraciones en la base de datos ${config.mongo.db} para el cliente ${config.tenant}\n`)

module.exports = function nomadRunner(nomad) {
  nomad.context.config = config
  nomad.context.ObjectId = ObjectId

  nomad.driver({
    connect(cb) {
      MongoClient.connect(config.mongo.url, (err, client) => {
        if (err) {
          return cb(err)
        }
        this.client = client
        this.db = client.db(config.mongo.db)
        return cb(null, this.db)
      })
    },

    disconnect(cb) {
      this.client.close(cb)
    },

    insertMigration(migration, cb) {
      this.db.collection('usuarioPruebas').insertOne(migration, cb) /* en collection migrations */
    },

    getMigrations(cb) {
      this.db.collection('usuarioPruebas').find().toArray(cb)
    },

    updateMigration(filename, migration, cb) {
      this.db.collection('usuarioPruebas').updateOne(
        {
          filename,
        },
        {
          $set: migration,
        },
        cb,
      )
    },

    removeMigration(filename, migration, cb) {
      this.db.collection('usuarioPruebas').updateOne(
        {
          filename,
        },
        {
          $set: migration,
        },
        cb,
      )
    },
  })
}
