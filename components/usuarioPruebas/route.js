const { Router } = require('express')
const bcrypt = require('bcrypt')
const createToken = require('../../utils/create-token')

const router = new Router()

router.get('/', getAllUsuariosPruebas)
router.get('/:id', getUsuarioPruebasById)
router.post('/', createUsuarioPruebas)
router.put('/:id', updateUsuarioPruebasById)
router.delete('/:id', deleteUsuarioPruebasById)

/* router.post('/login', createTokenDeUsuarioPruebas) */
router.post('/login', validateUserAndCreateToken)


async function getAllUsuariosPruebas(req, res, next) {
    try {
      const users = await req.model('UsuarioPruebas').find()
      res.send(users)
    } catch (err) {
      next(err)
    }
  }
  
  async function getUsuarioPruebasById(req, res, next) {
    console.log('getUsuariosPruebasById with id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(404).send('Id not found')
    }
  
    try {
      const user = await req.model('UsuarioPruebas').findById(req.params.id)/* .populate('role') */
  
      if (!user) {
        req.logger.error('User not found')
        res.status(404).send('User not found')
      }
  
      res.send(user)
    } catch (err) {
      next(err)
    }
  }
  
  async function createUsuarioPruebas(req, res, next) {
    console.log('createUsuarioPruebas: ', req.body)
  
    const user = req.body
  
    try {
  /*     const role = await req.model('Role').findOne({ name: user.role })
      if (!role) {
        req.logger.error('Role not found')
        res.status(404).send('Role not found')
      } COMENTADO POR MI*/
  
      const passEncrypted = await bcrypt.hash(user.password, 10)
      const userCreated = await req
        .model('UsuarioPruebas')
        .create({ ...user, password: passEncrypted/* , role: role._id COMENTADO POR MI */ })
  
      res.send(`User created :  ${userCreated.userName}`)
    } catch (err) {
      next(err)
    }
  }
  
  async function deleteUsuarioPruebasById(req, res, next) {
    console.log('deleteUsuarioPruebasById with id: ', req.params.id)
  
    if (!req.params.id) {
      res.status(500).send('The param id is not defined')
    }
  
    try {
      const user = await req.model('UsuarioPruebas').findById(req.params.id)
  
      if (!user) {
        req.logger.error('User not found')
        res.status(404).send('User not found')
      }
  
      await req.model('UsuarioPruebas').deleteOne({ _id: user._id })
  
      res.send(`User deleted :  ${req.params.id}`)
    } catch (err) {
      next(err)
    }
  }
  
  async function updateUsuarioPruebasById(req, res, next) {
    console.log('updateUsuarioPruebasById with id: ', req.params.id)
  
    const user = req.body
  
    try {
      const userToUpdate = await req.model('UsuarioPruebas').findById(req.params.id)
  
      if (!userToUpdate) {
        req.logger.error('User not found')
        res.status(404).send('User not found')
      }
  
      /* userToUpdate.isActive = user.isActive */
      userToUpdate.userName = user.userName
      userToUpdate.password = user.password
      await userToUpdate.save()
  
      res.send(userToUpdate)
    } catch (err) {
      next(err)
    }
  }

  async function validateUserAndCreateToken(req, res, next) {
    console.log('validateUserAndCreateToken: ', req.body)
    try {
        const user = await req.model('UsuarioPruebas').findOne({ userName: req.body.userName })

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
  
/*   async function createTokenDeUsuarioPruebas(req, res, next) {

    if (!req.body.userName) {
      req.logger.verbose('Parámetro userName faltante. Enviando 400 al cliente')
      return res.status(400).end()
    }

    req.logger.info(`Creando token de usuario para ${req.body.userName}`)
      
    if (!req.body.password) {
      req.logger.info('Parámetro password faltante. Enviando 400 al cliente')
      return res.status(400).end()
    }

    try {

      const usuario = await req.model('UsuarioPruebas').findOne({ userName: req.body.userName }, '+password')

      if (!usuario) {
        req.logger.verbose('Usuario no encontrado. Enviando 404 al cliente')
        return res.status(401).end()
      }
      
      req.logger.verbose('Revisando el password de usuario')
      const result = await usuario.checkPassword(req.body.password)
  
      delete usuario.password
  
      if (!result.isOk) {
        req.logger.verbose('Password inválido. Enviando 401 al cliente')
        return res.status(401).end()
      }
      
      const response = await generarToken(req, usuario)
      res.status(201).send(response)
    } catch (err) {
      next(err)
    }
  }
 */
  module.exports = router