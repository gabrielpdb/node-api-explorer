const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UsersController {
  async index(req, res) {
    const users = await knex('users')
    return res.json(users)
  }

  async show(req, res) {
    const { id } = req.params

    const user = await knex('users').where({ id })

    return res.json(user)
  }

  async create(req, res) {
    const { name, email, password, avatar } = req.body

    const hashedPassword = await hash(password, 8)

    const userAlreadyExists = await knex('users').where({ email }).first()

    if (userAlreadyExists) {
      throw new AppError('Usuário já cadastrado')
    }
    const user_id = await knex('users').insert({
      name,
      email,
      password: hashedPassword,
      avatar
    })

    console.log(user_id)
    return res.json({ user_id })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, email, avatar, password, oldPassword } = req.body

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    const userWithUpdatedEmail = await knex('users').where({ email }).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este email já está em uso')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

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

    const retorno = await knex('users').where({ id }).update(user)

    return res.json(retorno)
  }

  async delete(req, res) {
    const { id } = req.params

    const user = await knex('users').where({ id }).first()

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

    await knex('users').where({ id }).delete()

    return res.json()
  }
}

module.exports = UsersController
