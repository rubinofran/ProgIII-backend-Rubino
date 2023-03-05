
exports.name        = 'create-transaction';
exports.description = 'creates one transaction';

exports.isReversible = true;
exports.isIgnored    = false;

exports.up = (db, done) => {
  
  const date = new Date() 
  const migrationDate = `${date.getDate() > 9 ? '' : '0'}${date.getDate()}/${date.getMonth() > 8 ? '' : '0'}${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours() > 9 ? '' : '0'}${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`

  db.collection('transactions').insertOne(
    {
      _id: new ObjectId('300000000000000000000000'),
      transactionType: new ObjectId('200000000000000000000000'),
      userId: '100000000000000000000001', // George Dillon
      amount: 1000,
      createdAt: migrationDate, 
      __v: 0,
    },
    done,
  )
};

exports.down = (db, done) => {
  db.collection('transactions').deleteOne(
    {
      _id: new ObjectId('300000000000000000000000'),
    },
    done,
  )
};


