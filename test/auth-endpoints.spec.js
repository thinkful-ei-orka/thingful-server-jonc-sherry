const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Auth Endpoints', () => {
  let db

  const { testUsers } = helpers.makeThingsFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnet from db',() => db.destroy())

  before('clean up', () => helpers.cleanTables(db))

  afterEach('clean up', () => helpers.cleanTables(db))

  describe('POST /api/auth/login', () => {

    beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      }
      it(`responds with 400 Required err when '${field}' is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request body`})
      })

    })

  })

  it(`responds 400 'Invalid user_name or password' when bad user_name`, () => {
    const userInvalidUser = { user_name: 'user-not', password: 'existy' }
    return supertest(app)
      .post('/api/auth/login')
      .send(userInvalidUser)
      .expect(400, { error: `Incorrent user_name or password` })
  })
}) 