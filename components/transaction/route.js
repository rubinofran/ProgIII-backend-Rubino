const { Router } = require('express')
const createDate = require('../../utils/create-date')

const router = new Router()

router.get('/transactionRoute/', getAllTransactions) 
router.get('/transactionRoute/all/:id', getAllTransactionsByUserId)
/* router.get('/:id', getTransactionById) // unused */
router.post('/transactionRoute/', createTransaction)
/*router.delete('/:id', deleteTransactionById) // unused */

async function getAllTransactions(req, res, next) {
    try {
        const transactions = await req.model('Transaction').find().populate('transactionType')
        res.send(transactions)
    } catch (err) {
        next(err)
    }
}

async function getAllTransactionsByUserId(req, res, next) {

    if (!req.params.id) {
        req.logger.error('Id no encontrado. Enviando 404 al cliente')
        res.status(404).send('Id no encontrado')
      }
    console.log('getAllTransactionsByUserId con id: ', req.params.id)

    try {
        const transactions = await req.model('Transaction').find({userId: req.params.id}).populate('transactionType')
        // Sin validar, peor caso: array vacío

        res.send(transactions)
    } catch (err) {
        next(err)
    }
}

/* async function getTransactionById(req, res, next) {

    if (!req.params.id) {
        req.logger.error('Id no encontrado. Enviando 404 al cliente')
        res.status(404).send('Transacción no encontrada')
    }
    console.log('getTransactionById con id: ', req.params.id)
  
    try {
        const transaction = await req.model('Transaction').findById(req.params.id).populate('transactionType')
        if (!transaction) {
            req.logger.error('Transacción no encontrada, Enviando 404 al cliente')
            res.status(404).send('Transacción no encontrada')
        }
  
        res.send(transaction)
    } catch (err) {
        next(err)
    }
} */

async function createTransaction(req, res, next) {
    console.log('createTransaction: ', req.body)
  
    if (!req.body.transactionType) {
        req.logger.error('Tipo de transacción no encontrada. Enviando 404 al cliente')
        res.status(404).send('Tipo de transacción no encontrada')
    }

    const transaction = req.body
  
    try {
        const transactionType = await req.model('Type').findOne({ typeName: transaction.transactionType })
        if (!transactionType) {
            req.logger.error('Tipo de transacción no encontrada. Enviando 404 al cliente')
            res.status(404).send('Tipo de transacción no encontrada')
        } 

        const transactionCreated = await req
            .model('Transaction')
            .create({ 
              ...transaction, 
              transactionType: transactionType._id,
              createdAt: createDate()
        })
  
        // Se debe recibir además el id del destinatario para modificar su dinero, a futuro
/*         const userToUpdate = await req.model('User').findById(req.params.userId)
        if (!userToUpdate) {
          req.logger.error('Usuario no encontrado')
          res.status(404).send('Usuario no encontrado')
        }
        userToUpdate.moneyInAccount = transaction.transactionType === 'deposit'
            ? userToUpdate.moneyInAccount + Number(req.params.amount)
            : userToUpdate.moneyInAccount - Number(req.params.amount)
        userToUpdate.updatedAt = createDate()
        await userToUpdate.save() */

        res.send(transactionCreated) // `Transacción creada:  ${transactionCreated}`
    } catch (err) {
        next(err)
    }
}

/* async function deleteTransactionById(req, res, next) {
  
    if (!req.params.id) {
        req.logger.error('Id no encontrado. Enviando 404 al cliente')
        res.status(404).send('Id no encontrado')
    }
    console.log('deleteTransactionById con id: ', req.params.id)
  
    try {
      const transaction = await req.model('Transaction').findById(req.params.id)
  
      if (!transaction) {
        req.logger.error('Transacción no encontrada, Enviando 404 al cliente')
        res.status(404).send('Transacción no encontrada')
      }
  
      await req.model('Transaction').deleteOne({ _id: transaction._id })
  
      res.send(`Transacción eliminada:  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
} */

module.exports = router