const { Router } = require('express')
const createDate = require('../../utils/create-date')

const router = new Router()

router.get('/', getAllTransactions) 
router.get('/all/:id', getAllTransactionsByUserId)
/* router.get('/:id', getTransactionById) // unused */
router.post('/', createTransaction)
/*router.delete('/:id', deleteTransactionById) */

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
        res.status(404).send('Id no encontrado')
      }
    console.log('getAllTransactionsByUserId con id: ', req.params.id)

    try {
        const transactions = await req.model('Transaction').find({userId: req.params.id}).populate('transactionType')
        res.send(transactions)
    } catch (err) {
        next(err)
    }
}

/* async function getTransactionById(req, res, next) {

    if (!req.params.id) {
        res.status(404).send('Transacción no encontrada')
    }
    console.log('getTransactionById con id: ', req.params.id)
  
    try {
        const transaction = await req.model('Transaction').findById(req.params.id).populate('transactionType')
  
        if (!transaction) {
            req.logger.error('Transacción no encontrada')
            res.status(404).send('Transacción no encontrada')
        }
  
        res.send(transaction)
    } catch (err) {
        next(err)
    }
} */

async function createTransaction(req, res, next) {
    console.log('createTransaction: ', req.body)
  
    const transaction = req.body
  
    try {
        const transactionType = await req.model('Type').findOne({ typeName: transaction.transactionType })
        if (!transactionType) {
            req.logger.error('Tipo de transacción no encontrada')
            res.status(404).send('Tipo de transacción no encontrada')
        } 

        const transactionCreated = await req
            .model('Transaction')
            .create({ 
              ...transaction, 
              transactionType: transactionType._id,
              createdAt: createDate()
        })
  
        // Se debe recibir además el id del destinatario para modificar su dinero
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
      res.status(500).send('Id no encontrado')
    }
    console.log('deleteTransactionById con id: ', req.params.id)
  
    try {
      const transaction = await req.model('Transaction').findById(req.params.id)
  
      if (!transaction) {
        req.logger.error('Transacción no encontrada')
        res.status(404).send('Transacción no encontrada')
      }
  
      await req.model('Transaction').deleteOne({ _id: transaction._id })
  
      res.send(`Transacción eliminada:  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
} */

module.exports = router