const { Router } = require('express')

const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()

const controller = new UsersController()

usersRoutes.get('/', controller.index)
usersRoutes.get('/:id', controller.show)
usersRoutes.post('/', controller.create)
usersRoutes.put('/:id', controller.update)
usersRoutes.delete('/:id', controller.delete)

module.exports = usersRoutes
