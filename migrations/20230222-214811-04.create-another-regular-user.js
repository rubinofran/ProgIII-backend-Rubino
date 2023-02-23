
exports.name        = 'create-another-regular-user';
exports.description = 'creates another regular user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  db.collection('users').insertOne(
    {
      _id: new ObjectId('000000000000000000000002'),
      userName: 'user2@banco.com',
      password: '$2b$10$zOGpIALV5SkUez7NQ3cGUuQEg0zONnE2haDtSuyQ2X93P.bDOxmuu', // 2User1234
      clientType: 'Persona física',
      name: 'Al Dillon',
      address: 'Dirección2 222',
      accountType: 'Cuenta corriente', 
      cbu: 128643216080402,
      alias: 'TECHO.PIEDRA.GALERA',
      moneyInAccount: 5000,
      isActive: true,
      role: new ObjectId('000000000000000000000001'),
      createdAt: new Date(),
      updatedAt: new Date(), 
      __v: 0,
    },
    done,
  )
};

exports.down = (db, done) => {
  db.collection('users').deleteOne(
    {
      _id: new ObjectId('000000000000000000000002'),
    },
    done,
  )
};