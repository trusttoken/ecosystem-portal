import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'

import './css/app.scss'
import store from '@/store'
import App from '@/app'

require('typeface-lato')
require('typeface-poppins')

if (process.env.NODE_ENV === 'production' && process.env.CLIENT_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.CLIENT_SENTRY_DSN })
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
)
