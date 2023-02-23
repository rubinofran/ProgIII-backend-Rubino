
exports.name        = 'create-regular-user';
exports.description = 'creates a regular user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  db.collection('users').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      userName: 'user1@banco.com',
      password: '$2b$10$5TykcnyTSLZsaH/1dbTV4OoQjHtweVzf6vcpm48XhdQMkyFVkEgIC', // 1User1234
      clientType: 'Persona física',
      name: 'Alan Schaefer',
      address: 'Dirección1 111',
      accountType: 'Cuenta corriente', 
      cbu: 128643216080401,
      alias: 'PISO.PIEDRA.GALERA',
      moneyInAccount: 2000,
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
      _id: new ObjectId('000000000000000000000001'),
    },
    done,
  )
};
