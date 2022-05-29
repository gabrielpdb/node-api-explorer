const { Router } = require('express')

const MovieNotesController = require('../controllers/MovieNotesController')

const movieNotesRoutes = Router()

const controller = new MovieNotesController()

movieNotesRoutes.get('/', controller.index)
movieNotesRoutes.get('/:id', controller.show)
movieNotesRoutes.post('/', controller.create)
movieNotesRoutes.put('/:id', controller.update)
movieNotesRoutes.delete('/:id', controller.delete)

module.exports = movieNotesRoutes
