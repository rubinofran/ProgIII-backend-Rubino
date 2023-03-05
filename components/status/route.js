const { Router } = require('express')
const pkg = require('../../package.json')

const router = new Router()

router.get('/', getRoot)

function getRoot(req, res) {
  req.logger.verbose('Respondiento a la solicitud de root')
  req.logger.verbose('Enviando respuesta al cliente')
  
  /* eslint-disable no-undef */
  res.send({
    name: pkg.name,
    version: pkg.version,
    port: process.env.PORT,
    environment: process.env.NODE_ENV
  })
}

module.exports = router
