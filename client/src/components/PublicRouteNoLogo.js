import React from 'react'
import { Route } from 'react-router-dom'

const PublicRouteNoLogo = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <div className="not-logged-in">
          <div className="text-center" style={{ backgroundColor: '#061439' }}>
          </div>
          <Component {...props} />
        </div>
      )}
    />
  )
}

export default PublicRouteNoLogo
