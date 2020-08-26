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
import TrustTokenLogotype from '@/assets/tt_logotype_small_color_hires.png';
import { EthService } from '@/contracts/EthService';


const DropdownContainer = styled.div`
  display: inline;
  float: left;
`;


const MenuSpan = styled.span`
  display: inline-block;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
`;


const AccountActionsBox = styled.div`
  color: #638298;
  text-align: center;
  vertical-align: center;
`;


const LeftSpan = styled.span`
  float: left;
`;


const RightSpan = styled.span`
  float: right;
`;


const Menu = props => {
  return (
    <MenuSpan>
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
    </MenuSpan>
  );
}


const AccountActions = props => {
  const [redirectTo, setRedirectTo] = useState(false)

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <AccountActionsBox>

      <LeftSpan>
        <img src={TrustTokenLogotype} width='136px' height='32px'  />

      </LeftSpan>

      { <MenuSpan> &nbsp; </MenuSpan> 
        /* EthService.isConnectedToMetaMask() && <Menu/> || null */ 
      }

      { EthService.isConnectedToMetaMask() &&
          <RightSpan>
            <DropdownContainer>
              <EthAccountDropdown />
            </DropdownContainer>
          </RightSpan>
        || null
      }

    </AccountActionsBox>
  );
}

export default AccountActions
