const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const hashedPassword = await hash(password, 8)

    const userAlreadyExists = await knex('users').where({ email }).first()

    if (userAlreadyExists) {
      throw new AppError('Usuário já cadastrado')
    }
    const user_id = await knex('users').insert({
      name,
      email,
      password: hashedPassword
    })

    return res.status(201).json({ user_id })
  }

  async update(req, res) {
    const user_id = req.user.id
    const { name, email, password, oldPassword } = req.body

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este email já está em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.updated_at = knex.fn.now()

    if (password && !oldPassword) {
      throw new AppError(
        'Você precisa informar a senha antigo para definir uma nova'
      )
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere')
      }

      user.password = await hash(password, 8)
    }

    await knex('users').where({ id: user_id }).update(user)

    return res.json()
  }
}

module.exports = UsersController
