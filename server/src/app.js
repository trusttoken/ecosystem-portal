const cron = require('node-cron')
const logger = require('./logger')

const { executeTransfers } = require('./tasks/transfer')

try {
  require('envkey')
} catch (error) {
  logger.warn('EnvKey not configured')
}

const express = require('express')
const app = express()
const Sentry = require('@sentry/node')
if (process.env.NODE_ENV === 'production' && process.env.SERVER_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SERVER_SENTRY_DSN })
}
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const session = require('express-session')
const useragent = require('express-useragent')
require('./passport')()
const SQLiteStore = require('connect-sqlite3')(session)
const helmet = require('helmet')

const { networkId, port, sessionSecret, magic } = require('./config')

// Session setup
const sessionConfig = {
  cookie: {
    secure: false,
    // 30 minute TTL
    maxAge: 30 * 60 * 1000,
    httpOnly: true
  },
  resave: false, // Do not force session to get saved if it was not modified by the request.
  saveUninitialized: true,
  secret: sessionSecret,
  store: new SQLiteStore({
    dir: path.resolve(__dirname + '/../data'),
    db: 'sessions.sqlite3'
  })
}

if (app.get('env') === 'production' || process.env.HEROKU) {
  app.set('trust proxy', 1) // trust first proxy
  sessionConfig.cookie.secure = true // serve secure cookies in production
} else {
  // CORS configuration for local development and test deployments in the cloud (CI)
  app.use(
    cors({
      origin: process.env.DEPLOYMENT_URL || 'http://localhost:3000',
      credentials: true,
      exposedHeaders: ['X-Authenticated-Email']
    })
  )
}

// Configure CORS in Heroku, outside of Heroku this is handled by Kubernetes nginx ingress
if (process.env.HEROKU) {
  // Whitelisted domains
  const corsWhitelist = [
    'https://tt-ecosystem-portal-web.herokuapp.com',
    'https://portal.trusttoken.com',
  ].concat(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || corsWhitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
      exposedHeaders: ['X-Authenticated-Email']
    })
  )
}

app.use(helmet())

app.use(session(sessionConfig))

// Parse request bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// Passport specific
app.use(passport.initialize())
app.use(passport.session())

// User agent parsing
app.use(useragent.express())

app.use(require('./controllers'))

// Catch all
app.all('*', function(req, res) {
  res.status(404).send({
    errors: ['The page you are looking for does not exist']
  })
})

const hasWallet =
  (networkId === 2222 && process.env.ORIGIN_MNEMONIC) ||
  (networkId === 4 && process.env.RINKEBY_MNEMONIC) ||
  (networkId === 1 && process.env.MAINNET_MNEMONIC)

app.listen(port, () => {
  logger.info(`Listening on port ${port}`)
  if (hasWallet) {
    // Setup token library
    cron.schedule('*/10 * * * * *', () => executeTransfers())
  } else {
    logger.warn('Not wallet mnemonic found, not executing any transfers')
  }
})

module.exports = app
