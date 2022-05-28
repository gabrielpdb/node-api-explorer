const { Router } = require('express')

const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()

const controller = new UsersController()

usersRoutes.get('/', controller.index)

module.exports = usersRoutes
