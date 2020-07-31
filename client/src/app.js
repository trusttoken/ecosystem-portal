import React, { useEffect, useState } from 'react'
import { withRouter, Switch } from 'react-router-dom'

import Modal from '@/components/Modal'
import ScrollToTop from '@/components/ScrollToTop'
import PrivateRoute from '@/components/PrivateRoute'
import PublicRoute from '@/components/PublicRoute'
import PublicRouteNoLogo from '@/components/PublicRouteNoLogo'
import { Route } from 'react-router-dom'
import withTracker from '@/hoc/withTracker'

// Public routes
import Welcome from '@/components/pages/Welcome'
import RevisedSchedule from '@/components/pages/RevisedSchedule'
import TermsOfUse from '@/components/pages/TermsOfUse'
import PrivacyPolicy from '@/components/pages/PrivacyPolicy'
import Login from '@/components/pages/Login'
import HandleLogin from '@/components/pages/HandleLogin'
// Private routes
import Lockup from '@/components/pages/Lockup'
import LockupConfirm from '@/components/pages/LockupConfirm'
import Dashboard from '@/components/pages/Dashboard'
import { TrueRewards } from '@/components/pages/TrueRewards';
import { TrustTokenAssurance } from '@/components/pages/TrustTokenAssurance';
import News from '@/components/pages/News'
import WithdrawalDetail from '@/components/pages/WithdrawalDetail'
import WithdrawalHistory from '@/components/pages/WithdrawalHistory'
import Security from '@/components/pages/Security'
import NotFound from '@/components/pages/NotFound'

import { pageTitle } from '@/constants'

const App = () => {
  const [displayMobileWarning, setDisplayMobileWarning] = useState(
    window.innerWidth < 768 && !localStorage.getItem('mobileWarningDismissed')
  )

  useEffect(() => {
    document.title = pageTitle
  }, [])

  const dismissMobileWarning = () => {
    localStorage.setItem('mobileWarningDismissed', true)
    setDisplayMobileWarning(false)
  }

  const renderMobileWarning = () => {
    return (
      <Modal appendToId="main" onClose={dismissMobileWarning} closeBtn={true}>
        <h1 className="mb-4">Small Screen</h1>
        <p>
          The TrustToken Purchaser Portal is intended to be used with a larger
          screen. Please access your account from a desktop or laptop computer.
        </p>
        <button
          type="submit"
          className="btn btn-primary btn-lg mt-4"
          onClick={dismissMobileWarning}
        >
          Got it
        </button>
      </Modal>
    )
  }

  return (
    <>
      {displayMobileWarning && renderMobileWarning()}
      <ScrollToTop />
      <Switch>
        <PublicRoute exact path="/" component={Login} />
        <PublicRoute path="/login_handler/:token" component={HandleLogin} />
        <PublicRouteNoLogo path="/terms-of-use" component={TermsOfUse} />
        <PublicRouteNoLogo path="/privacy-policy" component={PrivacyPolicy} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/assurance" component={TrustTokenAssurance} />
        <PrivateRoute path="/truerewards" component={TrueRewards} />
        <PrivateRoute exact path="/lockup" component={Lockup} />
        <PrivateRoute path="/lockup/:id/:token" component={LockupConfirm} />
        <PrivateRoute exact path="/withdrawal" component={WithdrawalHistory} />
        <PrivateRoute
          path="/withdrawal/:id/:token?"
          component={WithdrawalDetail}
        />
        <PrivateRoute path="/security" component={Security} />
        <Route component={NotFound} />
      </Switch>
    </>
  )
}

export default withRouter(withTracker(App))
