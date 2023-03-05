const { Router } = require('express')
const pkg = require('../../package.json')

const router = new Router()

router.get('/', getRoot)
router.get('/status', getStatus)

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

async function getStatus(req, res, next) {
  req.logger.verbose('Respondiendo a la solicitud de estado')

  // if (!req.isAuthenticated()) {
  // 	return res.status(403).end();
  // }

  try {
    const result = await req.pingDatabase()

    if (!result || !result.ok) {
      return res.sendStatus(503)
    }

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}

module.exports = router
