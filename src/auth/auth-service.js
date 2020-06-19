const bcrypt = require('bcryptjs')

const AuthService = {
  getUserWithUsername(db, user_name) {
    return db('thingful_users').where({user_name}).first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  
}