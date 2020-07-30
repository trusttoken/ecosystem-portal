import React, { useEffect, useState } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { fetchUser } from '@/actions/user'
import { getUser, getIsLoading } from '@/reducers/user'
import { getSessionExpired } from '@/reducers/session'
import { setSessionExpired } from '@/actions/session'
import ConnectWallet from "@/components/ConnectWallet"

import Footer from '@/components/Footer';
import AccountActions from '@/components/AccountActions'
import Modal from '@/components/Modal'
import { ThemeProvider } from '@/providers/theme'
import { DataProvider } from '@/providers/data'

const PrivateRoute = ({
  component: Component,
  history,
  isLoading,
  user,
  ...rest
}) => {
  const [expandSidebar, setExpandSidebar] = useState(false)

  useEffect(rest.fetchUser, [])

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
            <div id="private" className="logged-in d-flex">
              {isLoading || !user
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
                      { // TODO: handle case when MetaMask not installed at all
                        web3 === "undefined"
                        || ! web3.eth.accounts
                        || web3.eth.accounts.length == 0
                        ? <ConnectWallet redirectTo={window.location.pathname} />
                        :
                          <DataProvider>
                              <div className="d-none d-md-block">
                                <AccountActions user={user} />
                              </div>
                              <div className="mt-md-4">
                                <Component {...props} user={user} />
                              </div>
                          </DataProvider>
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
      {rest.sessionExpired && !isLoading && (
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

const mapStateToProps = ({ session, user }) => {
  return {
    isLoading: getIsLoading(user),
    sessionExpired: getSessionExpired(session),
    user: getUser(user)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchUser: fetchUser,
      setSessionExpired: setSessionExpired
    },
    dispatch
  )

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
)
