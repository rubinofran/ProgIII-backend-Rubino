
exports.name        = 'create-admin-user';
exports.description = 'creates the admin user';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  db.collection('users').insertOne(
    {
      _id: new ObjectId('000000000000000000000000'),
      userName: 'admin@banco.com',
      password: '$2b$10$B1/9vxD06YW6w5NABThSSOURXsUb3YFMFqcZsNxDtPZowu6eex3re', // 1Admin1234
      name: 'Francisco Rubino',
      isActive: true, 
      role: new ObjectId('000000000000000000000000'),
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
      _id: new ObjectId('000000000000000000000000'),
    },
    done,
  )
};
