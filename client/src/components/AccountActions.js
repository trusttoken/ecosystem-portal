import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import get from 'lodash.get'
import styled from 'styled-components';

import { apiUrl } from '@/constants'
import agent from '@/utils/agent'
import ThemeToggle from '@/components/ThemeToggle'
import { EthAccountDropdown } from '@/components/EthAccountDropdown';

import { shortenAddress } from '@/lib/account';

import { DataContext } from '@/providers/data';

const DropdownContainer = styled.div`
  display: inline;
  float: left;
`;

const AccountActions = props => {
  const data = useContext(DataContext);
  const [redirectTo, setRedirectTo] = useState(false)
  const [dropdownToggleText, setDropdownToggleText] = useState('');

  if (!dropdownToggleText && data.accounts && data.accounts[0]) {
    const shortenedAddress = shortenAddress(data.accounts[0].address, 6, 4);
    setDropdownToggleText(`${data.accounts[0].nickname} ${shortenedAddress}`);
  }

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
          <EthAccountDropdown />
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
