class UsersController {
  async index(req, res) {
    console.log('Chegou no index de users')
    return res.json()
  }
}

module.exports = UsersController
