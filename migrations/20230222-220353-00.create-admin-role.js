
exports.name        = 'create-admin-role';
exports.description = 'creates the admin role';

exports.isReversible = true;
exports.isIgnored    = false;


exports.up = (db, done) => {
  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000000'),
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    done,
  )
}

exports.down = (db, done) => {
  db.collection('roles').deleteOne(
    {
      _id: new ObjectId('000000000000000000000000'),
    },
    done,
  )
}

