const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class MovieNotesController {
  async index(req, res) {
    const { title, tags } = req.query

    let notes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex('movie_tags')
        .select([
          'movie_notes.id',
          'movie_notes.title',
          'movie_notes.description',
          'movie_notes.rating',
          'movie_tags.name'
        ])
        .whereLike('movie_notes.title', `%${title}%`)
        .whereIn('name', filterTags)
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
    } else {
      notes = await knex('movie_notes').whereLike('title', `%${title}%`)
    }
    return res.json(notes)
  }

  async show(req, res) {
    const { id } = req.params

    const movie_note = await knex('movie_notes').where({ id })

    return res.json(movie_note)
  }

  async create(req, res) {
    const { title, description, rating, user_id, tags } = req.body

    const noteAlreadyExists = await knex('movie_notes').where({ title }).first()

    if (noteAlreadyExists) {
      throw new AppError('Filme já cadastrado')
    }

    const movie_note_id = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(tag => {
      return {
        note_id: movie_note_id,
        user_id,
        name: tag
      }
    })

    await knex('movie_tags').insert(tagsInsert)

    return res.json({ movie_note_id })
  }

  async update(req, res) {
    const { id } = req.params
    const { title, description, rating, tags } = req.body

    const movie_note = await knex('movie_notes').where({ id }).first()

    if (!movie_note) {
      throw new AppError('Nota não encontrada')
    }

    const noteWithUpdatedTitle = await knex('movie_notes')
      .where({ title })
      .first()

    if (noteWithUpdatedTitle && noteWithUpdatedTitle.id !== movie_note.id) {
      throw new AppError('Este título já está em uso')
    }

    movie_note.title = title ?? movie_note.title
    movie_note.description = description ?? movie_note.description
    movie_note.rating = rating ?? movie_note.rating
    movie_note.updated_at = knex.fn.now()

    if (tags) {
      await knex('movie_tags').where({ note_id: id }).delete()

      const tagsInsert = tags.map(tag => {
        return {
          note_id: id,
          user_id: movie_note.user_id,
          name: tag
        }
      })

      await knex('movie_tags').insert(tagsInsert)
    }

    await knex('movie_notes').where({ id }).update(movie_note)

    return res.json()
  }

  async delete(req, res) {
    const { id } = req.params

    const movie_note = await knex('movie_notes').where({ id }).first()

    if (!movie_note) {
      throw new AppError('Nota não encontrada')
    }

    await knex('movie_notes').where({ id }).delete()

    return res.json()
  }
}

module.exports = MovieNotesController
