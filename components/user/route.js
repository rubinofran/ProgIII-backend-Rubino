const { Router } = require('express')
const bcrypt = require('bcrypt')
const createDate = require('../../utils/create-date')
const createAlias = require('../../utils/create-alias')
const { authentication, authorization } = require('../auth/middleware')

const router = new Router()

router.get('/userRoute/', authentication, authorization, getAllUsers)
router.get('/userRoute/:id', authentication, authorization, getUserById)
router.get('/userRoute/findBy/:alias', authentication, authorization, getUserByAlias)
router.post('/', createUser)
router.delete('/userRoute/:id', authentication, authorization, deleteUserById) 
router.put('/userRoute/:id', authentication, authorization, updateUserById)

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
    req.logger.error('Id no encontrado. Enviando 404 al cliente')
    res.status(404).send('Id no encontrado')
  }
  console.log('getUserById con id: ', req.params.id)

  try {
    const user = await req.model('User').findById(req.params.id).populate('role')
    if (!user) {
      req.logger.error('Usuario no encontrado. Enviando 404 al cliente')
      res.status(404).send('Usuario no encontrado')
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function getUserByAlias(req, res, next) {

  if (!req.params.alias) {
    req.logger.error('Alias no encontrado. Enviando 404 al cliente')
    res.status(404).send('Alias no encontrado')
  }
  console.log('getUserByAlias con alias: ', req.params.alias)

  try {
    let user = await req.model('User').findOne({ alias: req.params.alias })
    if (!user) {
      req.logger.error(`Usuario con alias ${req.params.alias} no encontrado. Enviando 404 al cliente`)
      res.status(404).send(`Usuario con alias ${req.params.alias} no encontrado`)
    }
    
    // Seguridad
    const { _id, userName, name, moneyInAccount, isActive } = user
     
    res.send({ _id, userName, name, moneyInAccount, isActive })
  } catch (err) {
    next(err)
  }
}

async function createUser(req, res, next) {
  console.log('createUser: ', req.body)

  if (!req.body.role) {
    req.logger.error('Rol no encontrado. Enviando 404 al cliente')
    res.status(404).send('Rol no encontrado')
  }

  if (!req.body.userName) {
    req.logger.error('Usuario no encontrado. Enviando 404 al cliente')
    res.status(404).send('Usuario no encontrado')
  }

  const user = req.body

  try {
    const role = await req.model('Role').findOne({ name: user.role })
    if (!role) {
      req.logger.error('Rol no encontrado. Enviando 404 al cliente')
      res.status(404).send('Rol no encontrado')
    } 

    const userFound = await req.model('User').findOne({ userName: user.userName })
    if (userFound) {
      req.logger.verbose('Ya existe una cuenta con ese usuario. Enviando 409 al cliente')
      res.status(409).send('Ya existe una cuenta con ese usuario')
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
    req.logger.error('Id no encontrado. Enviando 404 al cliente')
    res.status(404).send('Id no encontrado')
  }
  console.log('deleteUserById con id: ', req.params.id)

  try {
    const user = await req.model('User').findById(req.params.id)
    if (!user) {
      req.logger.error('Usuario no encontrado. Enviando 404 al cliente')
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
    req.logger.error('Id no encontrado. Enviando 404 al cliente')
    res.status(404).send('Id no encontrado')
  }
  console.log('updateUserById con id: ', req.params.id)

  const user = req.body

  try {
    const userToUpdate = await req.model('User').findById(req.params.id)
    if (!userToUpdate) {
      req.logger.error('Usuario no encontrado. Enviando 404 al cliente')
      res.status(404).send('Usuario no encontrado')
    }

    if(Object.keys(user).length == 1) { 
      const schemaField = Object.keys(user)[0]
      userToUpdate[schemaField] = user[schemaField]
    } else { // More than one field
      userToUpdate.name = user.name
      userToUpdate.address = user.address  
    }
		
    userToUpdate.updatedAt = createDate()
    await userToUpdate.save()

    res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

module.exports = router
