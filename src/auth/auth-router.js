const express = require('express')
const jsonBodyParser = express.json()
const AuthService = require('./auth-service')

const authRouter = express.Router()

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for(const [key, value] of Object.entries(loginUser))
      if(value == null) 
        return res.status(400).json({ error: `Missing '${key}' in request body`})
      
    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
    .then(dbUser => {
      if(!dbUser)
        return res.status(400).json({ error: `Incorrect user_name or password` })
    })
    
      res.send('OK')
  }).catch(next)

  module.exports = authRouter