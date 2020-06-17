const chai = require('chai')
const expect = chai.expect
const request = require('../test_helper')
const express = require('express')

const { Account, User, sequelize } = require('../../src/models')

process.env.SENDGRID_FROM_EMAIL = 'test@test.com'
process.env.SENDGRID_API_KEY = 'test'
process.env.ENCRYPTION_SECRET = 'test'
process.env.SESSION_SECRET = 'test'

const app = require('../../src/app')

describe('Account HTTP API', () => {
  beforeEach(async () => {
    // Wipe database before each test
    expect(process.env.NODE_ENV).to.equal('test')
    await sequelize.sync({ force: true })

    this.user = await User.create({
      email: 'user@trusttoken.com',
      name: 'User 1'
    })

    this.user2 = await User.create({
      email: 'user2@trusttoken.com',
      name: 'User 2'
    })

    this.mockApp = express()
    this.mockApp.use((req, res, next) => {
      req.session = {
        passport: {
          user: this.user.id
        },
        twoFA: 'totp'
      }
      next()
    })
    this.mockApp.use(app)
  })

  xit('should add an account', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    const response = await request(this.mockApp)
      .post('/api/accounts')
      .send({ nickname, address })
      .expect(201)

    expect(response.body.nickname).to.equal(nickname)
    expect(response.body.address).to.equal(address)

    const results = await Account.findAll()
    expect(results.length).to.equal(1)
    expect(results[0].nickname).to.equal(nickname)
    expect(results[0].address).to.equal(address)
  })

  xit('should error on adding account with missing eth address', async () => {
    const nickname = 'test'

    await request(this.mockApp)
      .post('/api/accounts')
      .send({ nickname })
      .expect(422)
  })

  xit('should error on adding account with invalid eth address', async () => {
    const nickname = 'test',
      address = 'donkey'

    await request(this.mockApp)
      .post('/api/accounts')
      .send({ nickname, address })
      .expect(422)
  })

  xit('should error on adding account with duplicate eth address', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    await Account.create({
      userId: this.user.id,
      nickname: nickname,
      address: address
    })

    await request(this.mockApp)
      .post('/api/accounts')
      .send({ nickname: 'test2', address })
  })

  xit('should error on adding account with missing nickname', async () => {
    const address = '0x0000000000000000000000000000000000000000'

    await request(this.mockApp)
      .post('/api/accounts')
      .send({ address })
      .expect(422)
  })

  xit('should error on adding account with duplicate nickname', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    await Account.create({
      userId: this.user.id,
      nickname: nickname,
      address: address
    })

    await request(this.mockApp)
      .post('/api/accounts')
      .send({ nickname, address: '0x0000000000000000000000000000000000000001' })
      .expect(422)
  })

  xit('should return no accounts before any are added', async () => {
    const response = await request(this.mockApp)
      .get('/api/accounts')
      .expect(200)

    expect(response.body.length).to.equal(0)
  })

  xit('should return one account after one is added', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    await Account.create({
      userId: this.user.id,
      nickname: nickname,
      address: address
    })

    const response = await request(this.mockApp)
      .get('/api/accounts')
      .expect(200)

    expect(response.body.length).to.equal(1)
  })

  xit('should not return other users account', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    await Account.create({
      userId: this.user2.id,
      nickname: nickname,
      address: address
    })

    const response = await request(this.mockApp)
      .get('/api/accounts')
      .expect(200)

    expect(response.body.length).to.equal(0)
  })

  xit('should edit an account', async () => {})

  xit('should not edit other users account', async () => {})

  xit('should delete an account', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    const account = await Account.create({
      userId: this.user.id,
      nickname: nickname,
      address: address
    })

    await request(this.mockApp)
      .delete(`/api/accounts/${account.id}`)
      .expect(204)

    const accountAfterDelete = await Account.findOne({
      where: { id: account.id }
    })

    expect(accountAfterDelete).to.equal(null)
  })

  xit('should not delete other users account', async () => {
    const nickname = 'test',
      address = '0x0000000000000000000000000000000000000000'

    const account = await Account.create({
      userId: this.user2.id,
      nickname: nickname,
      address: address
    })

    await request(this.mockApp)
      .delete(`/api/accounts/${account.id}`)
      .expect(404)

    const accountAfterDelete = await Account.findOne({
      where: { id: account.id }
    })

    expect(accountAfterDelete.id).to.equal(account.id)
  })
})
