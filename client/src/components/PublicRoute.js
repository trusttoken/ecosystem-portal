import React from 'react'
import { Route } from 'react-router-dom'

import Logo from '@/assets/origin-logo.svg'
import TTLogo from '@/assets/tt_logotype_white.svg';

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <div className="not-logged-in">
          <div className="text-center" style={{ backgroundColor: '#061439' }}>
            <TTLogo className="my-5" />
          </div>
          <Component {...props} />
        </div>
      )}
    />
  )
}

export default PublicRoute
