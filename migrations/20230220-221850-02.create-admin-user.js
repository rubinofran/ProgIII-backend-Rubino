
exports.name        = 'create-admin-user';
exports.description = 'creates the admin user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  
  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getMonth() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('users').insertOne(
    {
      _id: new ObjectId('100000000000000000000000'),
      userName: 'admin1@banco.com',
      password: '$2b$10$B1/9vxD06YW6w5NABThSSOURXsUb3YFMFqcZsNxDtPZowu6eex3re', // 1Admin1234
      name: 'Alan Schaefer',
      isActive: true, 
      role: new ObjectId('000000000000000000000000'),
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
      _id: new ObjectId('100000000000000000000000'),
    },
    done,
  )
};
