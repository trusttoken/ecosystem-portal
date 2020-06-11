import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import get from 'lodash.get'
import styled from 'styled-components';

import { apiUrl } from '@/constants'
import agent from '@/utils/agent'
import ThemeToggle from '@/components/ThemeToggle'
import Dropdown from 'react-bootstrap/Dropdown'

const DropdownContainer = styled.div`
  display: inline;
  float: left;
`;

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
    <div>
      <div className="text-right" style={{ color: '#638298' }}>
        <DropdownContainer>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </DropdownContainer>
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
    </div>
  )
}

export default AccountActions
