import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import { apiUrl } from '@/constants'
import agent from '@/utils/agent'
import NavLink from '@/components/NavLink'
import Earn from '@/assets/earn-icon.svg'
import Dashboard from '@/assets/dashboard-icon.svg'
import History from '@/assets/history-icon.svg'
import News from '@/assets/news-icon.svg'
import Security from '@/assets/security-icon.svg'
import OLogo from '@/assets/0-rigin-logo.svg'
import OriginLogo from '@/assets/origin-logo.svg'
import TTSignLogo from '@/assets/tt_logosign_white.svg';
import TTLogo from '@/assets/tt_logotype_white.svg';

const Navigation = props => {
  const [redirectTo, setRedirectTo] = useState(null)

  const handleLogout = async () => {
    await agent.post(`${apiUrl}/api/logout`)
    setRedirectTo('/')
  }

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <nav
      id="sidebar"
      className={`${props.expandSidebar ? ' expanded' : ''}`}
      style={{ height: props.expandSidebar ? '100vh' : '' }}
    >
      <div className="nav-logo text-center">
        <div className="d-sm-none">
          <TTSignLogo />
        </div>
        <div className="d-none d-sm-block">
          <TTSignLogo />
        </div>
      </div>
      <div
        className={`nav-icon d-md-none ${
          props.expandSidebar ? 'nav-icon-open' : ''
        }`}
        onClick={props.onExpandSidebar}
      >
        <div></div>
      </div>
      <div
        className={`mt-5 ml-2 ${
          props.expandSidebar ? '' : 'd-none d-md-block'
        }`}
      >
        <ul className="navbar-nav">
          <li className="nav-item mb-5">
            <NavLink to="/dashboard" exact className="nav-link text">
              <Dashboard className="icon" />
              {props.expandSidebar && 'Dashboard'}
            </NavLink>
          </li>
        </ul>
        <ul className="navbar-nav mt-4 d-md-none">
          <li className="nav-item mt-4 mb-5">
            <a
              target="_blank"
              href="https://forum.trusttoken.com/c/tru-ecosystem-portal-support-updates/12"
              className="nav-link"
            >
              Contact Support? hi there
            </a>
          </li>
          <li className="nav-item">
            <a
              onClick={handleLogout}
              style={{ cursor: 'pointer' }}
              className="nav-link"
            >
              Logout test test test
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
