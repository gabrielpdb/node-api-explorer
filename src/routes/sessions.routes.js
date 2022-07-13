const { Router } = require('express')

const SessionsController = require('../controllers/SessionsController')

const sessionsRoutes = Router()

const controller = new SessionsController()

sessionsRoutes.post('/', controller.create)

module.exports = sessionsRoutes
