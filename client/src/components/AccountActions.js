import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import get from 'lodash.get'
import styled from 'styled-components';

import { EthAccountDropdown } from '@/components/EthAccountDropdown';


import DashboardIconBlue from '@/assets/dashboard-icon-blue.png';
import DashboardIconGray from '@/assets/dashboard-icon-gray.png';

import RewardsIconBlue from '@/assets/rewards-icon-blue.png';
import RewardsIconGray from '@/assets/rewards-icon-gray.png';
import SignIcon from '@/assets/Sign.png';
import TrustTokenIcon from '@/assets/TrustToken.png';

//import { DataContext } from '@/providers/data';

const DropdownContainer = styled.div`
  display: inline;
  float: left;
`;

const AccountActions = props => {
  const [redirectTo, setRedirectTo] = useState(false)

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
      <div style={{ color: '#638298', textAlign: 'center', verticalAlign: 'center'}}>

        <span style={{float: 'left'}}>
          <img src={SignIcon} />
          <img src={TrustTokenIcon} />
        </span>

        <span style={{
                    display: 'inline-block',
                    fontWeight: 'normal',
                    fontSize: '16px',
                    lineHeight: '24px',
                   }}
        >
          {
              window.location.href.endsWith('dashboard')
              ? <span style={{color: '#1253FA'}}> <img src={DashboardIconBlue}/> Dashboard </span>
              : <Link to="/dashboard"> <span style={{color: '#7A859E'}}> <img src={DashboardIconGray}/> Dashboard </span> </Link>
          }

          &nbsp;

          {
              window.location.href.endsWith('rewards')
              ? <span style={{color:'#1253FA'}}> <img src={RewardsIconBlue}/> Rewards </span>
              : <Link to="/truerewards"> <span style={{color:'#7A859E'}}> <img src={RewardsIconGray}/> Rewards </span> </Link>
          }
        </span>

        <span style={{float: 'right'}}>
          <DropdownContainer>
            <EthAccountDropdown />
          </DropdownContainer>
        </span>

      </div>
  )
}

export default AccountActions
