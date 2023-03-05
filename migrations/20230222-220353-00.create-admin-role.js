
exports.name        = 'create-admin-role';
exports.description = 'creates the admin role';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {

  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getMonth() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('roles').insertOne(
    {
      _id: new ObjectId('000000000000000000000000'),
      name: 'admin',
      createdAt: migrationDate,
      __v: 0,
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

