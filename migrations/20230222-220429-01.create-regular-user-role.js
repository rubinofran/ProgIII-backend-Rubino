
exports.name        = 'create-regular-user-role';
exports.description = 'creates the regular user role';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {

  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getDate() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      name: 'user',
      createdAt: migrationDate,
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
