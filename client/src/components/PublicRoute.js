import React from 'react'
import { Route } from 'react-router-dom'
import Footer from '@/components/Footer';

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <div style={{ backgroundColor: '#E5E5E5' }}>
          <Component {...props} />
          <Footer/>
        </div>
      )}
    />
  )
}

export default PublicRoute
