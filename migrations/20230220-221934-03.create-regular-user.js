
exports.name        = 'create-regular-user';
exports.description = 'creates a regular user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  
  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getDate() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('users').insertOne(
    {
      _id: new ObjectId('000000000000000000000001'),
      userName: 'user1@banco.com',
      password: '$2b$10$5TykcnyTSLZsaH/1dbTV4OoQjHtweVzf6vcpm48XhdQMkyFVkEgIC', // 1User1234
      clientType: 'Persona física',
      name: 'George Dillon',
      address: 'Dirección1 111',
      accountType: 'Cuenta corriente',
      alias: 'PISO.PIEDRA.GALERA',
      moneyInAccount: 2000,
      isActive: true,
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
      _id: new ObjectId('000000000000000000000001'),
    },
    done,
  )
};
