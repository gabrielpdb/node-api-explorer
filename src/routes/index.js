const { Router } = require('express')

const usersRoutes = require('./users.routes')
const movieNotesRoutes = require('./movie_notes.routes')
const sessionsRoutes = require('./sessions.routes')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/movie_notes', movieNotesRoutes)
routes.use('/sessions', sessionsRoutes)

module.exports = routes
