/* globals ObjectId */
exports.name = 'create-admin-user'
exports.description = 'creates the admin user'

exports.isReversible = true
exports.isIgnored = false

exports.up = function up(db, done) {
  db.collection('usuariopruebas').insertOne(
    {
      _id: new ObjectId('000000000000000000000000'),
      userName: 'admin',
      password: '$2b$10$X6QHSSwg6OpfVPcYQNAjFOmpzM7MUluiE1zCAxamb/I.K0smsw7/u', // Admin1234 
      createdAt: new Date(),
      updatedAt: new Date(), 
      __v: 0,
    },
    done,
  )
}

exports.down = function down(db, done) {
  db.collection('usuariopruebas').deleteOne(
    {
      _id: new ObjectId('000000000000000000000000'),
    },
    done,
  )
}