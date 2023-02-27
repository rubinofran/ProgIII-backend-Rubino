const { Router } = require('express')
const bcrypt = require('bcrypt')
const createToken = require('../../utils/create-token')

const router = new Router()

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.post('/', createUser)
router.delete('/:id', deleteUserById)
router.put('/:id', updateUserById)
router.post('/login', validateUserAndCreateToken)

async function getAllUsers(req, res, next) {
  try {
    const users = await req.model('User').find(/* { isActive: true } */).populate('role')
    res.send(users)
  } catch (err) {
    next(err)
  }
}

async function getUserById(req, res, next) {

  if (!req.params.id) {
    res.status(404).send('Id no encontrado')
  }
  console.log('getUserById con id: ', req.params.id)

  try {
    const user = await req.model('User').findById(req.params.id).populate('role')

    if (!user) {
      req.logger.error('Usuario no encontrado')
      res.status(404).send('Usuario no encontrado')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function createUser(req, res, next) {
  console.log('createUser: ', req.body)

  const user = req.body

  try {
    const role = await req.model('Role').findOne({ name: user.role })
    if (!role) {
      req.logger.error('Rol no encontrado')
      res.status(404).send('Rol no encontrado')
    } 

    const passEncrypted = await bcrypt.hash(user.password, 10)
    const userCreated = await req
      .model('User')
      .create({ ...user, password: passEncrypted, role: role._id })

    res.send(`Usuario creado:  ${userCreated.userName}`)
  } catch (err) {
    next(err)
  }
}

async function deleteUserById(req, res, next) {
  
  if (!req.params.id) {
    res.status(500).send('Id no encontrado')
  }
  console.log('deleteUserById con id: ', req.params.id)

  try {
    const user = await req.model('User').findById(req.params.id)

    if (!user) {
      req.logger.error('Usuario no encontrado')
      res.status(404).send('Usuario no encontrado')
    }

    await req.model('User').deleteOne({ _id: user._id })

    res.send(`Usuario eliminado:  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

async function updateUserById(req, res, next) {
  
  if (!req.params.id) {
    res.status(500).send('Id no encontrado')
  }
  console.log('updateUserById con id: ', req.params.id)

  const user = req.body

  try {
    const userToUpdate = await req.model('User').findById(req.params.id)

    if (!userToUpdate) {
      req.logger.error('Usuario no encontrado')
      res.status(404).send('Usuario no encontrado')
    }

    /* console.log(Object.keys(user).length) */
    if(Object.keys(user).length == 1) { // Alta, baja y modificación del dinero en la cuenta
      /* console.log(Object.keys(user)[0]) */
      const schemaField = Object.keys(user)[0]
      userToUpdate[schemaField] = user[schemaField]
    }
		
    const date = new Date() 
    userToUpdate.updatedAt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} Hora: ${date.getHours()}:${date.getMinutes() > 9 ? '' : '0'}${date.getMinutes()}`
    await userToUpdate.save()

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function validateUserAndCreateToken(req, res, next) {
  console.log('validateUserAndCreateToken: ', req.body)
  try {
      const user = await req.model('User').findOne({ userName: req.body.userName })

      const passwordCorrect = user == null
          ? false
          : await bcrypt.compare(req.body.password, user.password)
      
      if (!(user && passwordCorrect)) {
          req.logger.verbose('Password o usuario inválidos. Enviando 401 al cliente')
          res.status(401).json({
              error: 'Password o usuario inválidos'
          })
          return res.status(401).end()
      }
      delete user.password

      const response = await createToken(req, user)
      res.status(201).send(response)

  } catch (err) {
      next(err)
  }
}

module.exports = router
