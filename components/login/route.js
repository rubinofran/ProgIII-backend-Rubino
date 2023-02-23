const { Router } = require('express')
const bcrypt = require('bcrypt')
const createToken = require('../../utils/create-token')

const router = new Router()

router.post('/', validateUserAndCreateToken)

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

        const response = await createToken(req, user)
        res.status(201).send(response)

    } catch (err) {
        next(err)
    }
}

module.exports = router