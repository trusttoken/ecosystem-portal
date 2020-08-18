import React, { useEffect, useState } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { getSessionExpired } from '@/reducers/session'
import { setSessionExpired } from '@/actions/session'
import ConnectWallet from "@/components/ConnectWallet"

import Footer from '@/components/Footer';
import AccountActions from '@/components/AccountActions'
import Modal from '@/components/Modal'
import { ThemeProvider } from '@/providers/theme'
import { DataProvider } from '@/providers/data'

import { EthService } from '@/contracts/EthService';
import backgroundImage from '@/assets/starting_screen.png';

const backgroundDivStyle = {
  width: '100%',
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover'
};

const MaybeDataProvider = props => {
  return EthService.isConnectedToMetaMask()
    ?
      <DataProvider>
        {props.children}
      </DataProvider>
    :
      <>
        {props.children}
      </>
    ;
};

const PrivateRoute = ({
  component: Component,
  history,
  //isLoading,
  ...rest
}) => {
  const [expandSidebar, setExpandSidebar] = useState(false)

  useEffect(
    () =>
      history.listen(() => {
        setExpandSidebar(false)
      }),
    []
  )

  const toggleSidebar = () => {
    setExpandSidebar(!expandSidebar)
  }

  return (
    <>
      <Route
        {...rest}
        render={props => {
          return (
            <div id="private" className="logged-in d-flex" style={backgroundDivStyle}>
              { false //isLoading
               ? (
                <div id="main">
                  <div className="spinner-grow" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
               )
               : (
                <>
                  <ThemeProvider>
                    <div id="main" className={expandSidebar ? 'd-none' : ''}>
                      { ! EthService.isConnectedToMetaMask()
                        ? <ConnectWallet redirectTo={window.location.pathname} />
                        :
                          <MaybeDataProvider>
                            <div className="d-none d-md-block">
                              <AccountActions />
                            </div>
                            <div className="mt-md-4">
                              <Component {...props} />
                            </div>
                          </MaybeDataProvider>
                      }
                    </div>
                    <Footer/>
                  </ThemeProvider>
                </>
               )}
            </div>
          )
        }}
      />
      { false // rest.sessionExpired && !isLoading 
          && (
        <Modal>
          <h1 className="mb-2">Session Expired</h1>
          <p>
            Your session has expired. You will need to sign in again to
            continue.
          </p>
          <Link to="/">
            <button className="btn btn-primary btn-lg">Sign In</button>
          </Link>
        </Modal>
      )}
    </>
  )
}

const mapStateToProps = ({ session }) => {
  return {
    sessionExpired: getSessionExpired(session),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setSessionExpired: setSessionExpired
    },
    dispatch
  )

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
)
