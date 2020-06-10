import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import get from 'lodash.get'

import { apiUrl } from '@/constants'
import agent from '@/utils/agent'
import ThemeToggle from '@/components/ThemeToggle'

const AccountActions = props => {
  const [redirectTo, setRedirectTo] = useState(false)

  const handleLogout = async () => {
    await agent.post(`${apiUrl}/api/logout`)
    setRedirectTo('/')
  }

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <div className="text-right" style={{ color: '#638298' }}>
      <ThemeToggle />
      <small>
        {get(props.user, 'email')}
        <div className="mx-3 d-inline-block">|</div>
        <a
          className="text-muted"
          target="_blank"
          href="https://forum.trusttoken.com/c/tru-ecosystem-portal-support-updates/12"
        >
          Contact Support
        </a>
        <div className="mx-2 d-inline-block"></div>
        <a className="text-muted pointer" onClick={handleLogout}>
          Logout
        </a>
      </small>
    </div>
  )
}

export default AccountActions
