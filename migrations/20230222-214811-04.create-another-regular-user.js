

exports.name        = 'create-another-regular-user';
exports.description = 'creates another regular user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {

  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getMonth() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('users').insertOne(
    {
      _id: new ObjectId('100000000000000000000002'),
      userName: 'user2@banco.com',
      password: '$2b$10$zOGpIALV5SkUez7NQ3cGUuQEg0zONnE2haDtSuyQ2X93P.bDOxmuu', // 2User1234
      clientType: 'Persona física',
      name: 'Mac Eliot',
      address: 'Dirección2 222',
      accountType: 'Cuenta corriente',
      alias: 'PISO.GALERA.PIEDRA',
      moneyInAccount: 5000,
      isActive: false,
      role: new ObjectId('000000000000000000000001'),
      createdAt: migrationDate,
      updatedAt: migrationDate, 
      __v: 0,
    },
    done,
  )
};

exports.down = (db, done) => {
  db.collection('users').deleteOne(
    {
      _id: new ObjectId('100000000000000000000002'),
    },
    done,
  )
};