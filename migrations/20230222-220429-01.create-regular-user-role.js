
exports.name        = 'create-regular-user-role';
exports.description = 'creates the regular user role';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    done,
  )
}

exports.down = (db, done) => {
  db.collection('roles').deleteOne(
    {
      _id: new ObjectId('000000000000000000000001'),
    },
    done,
  )
}
