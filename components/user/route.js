const { Router } = require('express')
const bcrypt = require('bcrypt')
const createToken = require('../../utils/create-token')
const createDate = require('../../utils/create-date')
const createAlias = require('../../utils/create-alias')
const { authentication/* , authorization */ } = require('../auth/middleware')

const router = new Router()

router.get('/', getAllUsers)
router.get('/:id', authentication, getUserById)
router.get('/findBy/:alias', getUserByAlias)
router.post('/', createUser)
router.delete('/:id', deleteUserById)
router.put('/:id', updateUserById)
router.post('/login', validateUserAndCreateToken)

async function getAllUsers(req, res, next) {
  try {
    const users = await req.model('User').find().populate('role')
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

async function getUserByAlias(req, res, next) {

  if (!req.params.alias) {
    res.status(404).send('Alias no encontrado')
  }
  console.log('getUserByAlias con alias: ', req.params.alias)

  try {
    let user = await req.model('User').findOne({ alias: req.params.alias })

    if (!user) {
      req.logger.error('Usuario no encontrado')
      res.status(404).send('Usuario no encontrado')
    }
    
    // Seguridad
    const { _id, userName, name, moneyInAccount } = user
     
    res.send({ _id, userName, name, moneyInAccount })
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
    const users = await req.model('User').find()

    const passEncrypted = await bcrypt.hash(user.password, 10)
    const userCreated = await req
      .model('User')
      .create({ 
        ...user, 
        password: passEncrypted, 
        role: role._id, 
        alias: createAlias(users.filter(u => u.alias != undefined)), 
        isActive: true, 
        moneyInAccount: 0,
        createdAt: createDate(),
        updatedAt: createDate()
      })

    res.send(userCreated) // `Usuario creado:  ${userCreated}`
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

    if(Object.keys(user).length == 1) { 
      const schemaField = Object.keys(user)[0]
      userToUpdate[schemaField] = user[schemaField]
    }
		
    userToUpdate.updatedAt = createDate()
    await userToUpdate.save()

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function validateUserAndCreateToken(req, res, next) {
  console.log('validateUserAndCreateToken: ', req.body)

  if (!req.body.userName) {
    req.logger.verbose('Parámetro userName faltante. Enviando 400 al cliente')
    res.status(400).send('Parámetro userName faltante')
  }
  
  req.logger.info(`Intentando crear token de usuario para ${req.body.userName}`)

  if (!req.body.password) {
    req.logger.info('Parámetro password faltante. Enviando 400 al cliente')
    res.status(400).send('Parámetro password faltante')
  }

  try {
      const user = await req.model('User').findOne({ userName: req.body.userName })
      const passwordCorrect = user == null
          ? false
          : await bcrypt.compare(req.body.password, user.password)

      if (!(user && passwordCorrect)) {
          req.logger.verbose('Usuario o contraseña inválidos. Enviando 401 al cliente')
          res.status(401).send('Usuario o contraseña inválidos')
      }
      const response = await createToken(req, user)
      res.status(201).send(response)
  } catch (err) {
      next(err)
  }
}

module.exports = router
