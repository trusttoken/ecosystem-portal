import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';
import MetaMaskLogo from '@/assets/metamask_small.png';
import EmailWalletLogo from '@/assets/email_wallet_small.png';

import { EthService } from '@/contracts/EthService';
import { shortenAddress } from '@/lib/account';
import { DataContext } from '@/providers/data';
import { addAccount, deleteAccount, selectAccount, fetchAccounts } from '@/actions/account'
import { getError, getIsAdding, getIsLoading } from '@/reducers/account'

import connectingAnimation from '@/assets/connecting_animation.gif'

const GreenDot = styled.div`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #00DB8D;
  border-radius: 50%;
  margin-right: 8px;
`;


const GrayDot = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #E0E9EE;
`;


const DownArrow = styled.div`
  position: relative;
  top: -1px;
  display: inline-block;
  padding: 2px;
  border: solid #7A859E;
  border-width: 0 2px 2px 0;
  margin-left: 12px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
`;

const EthAccountDropdownToggleContainer = styled(Dropdown)`
  box-sizing: border-box;
  height: 40px;
  background: #FFFFFF;
  color: #638298;
  padding: 10px 16px;
  border: 1px solid #E0E9EE;
  border-radius: 2px;

  font-size: 14px;
  line-height: 20px;

  > div {
    display: flex;
    align-items: center;
  }

  &:hover {
    border: 1px solid #1253FA;
    cursor: pointer;
  }
`;


const EthAccountDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
  <EthAccountDropdownToggleContainer
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </EthAccountDropdownToggleContainer>
));

function renderTooltip(props) {
  return (
    <Tooltip id="button-tooltip" {...props}>
      {props.tooltipText}
    </Tooltip>
  );
}

function EnableMetaMaskDropdownItem(props) {
  const [tooltipText, setTooltipText] = useState('Use MetaMask wallet');

  const handleClick = (e) => {
    e.stopPropagation();

    console.log("EthService.state.metamaskInstalled: " + EthService.state.metamaskInstalled);
    if (! EthService.state.metamaskInstalled) {
        (async () => {
            const enableRes = await EthService.enableMetamask();
            if (enableRes.code === 4001) {
                setTooltipText("MetaMask NOT enabled.");
            } else {
              setTooltipText("MetaMask enabled!");

              const account = await EthService.signer().getAddress();
              console.log('MetaMask account:', JSON.stringify(account));

              if (!account) {
                console.log("No MetaMask account!?");
              } else {
                console.log("Adding MetaMask account " + JSON.stringify(account));
                const result = await props.parentprops.addAccount({
                  nickname: "MetaMask Wallet",
                  address: account
                });
              }
            }
        })();
    }

    setTooltipText(EthService.state.metamaskInstalled ? 'Detected MetaMask.' : 'Install MetaMask plugin.');
    if (EthService.state.metamaskInstalled) {
      setTimeout(() => {
        setTooltipText('Use your MetaMask wallet');
      }, 2500);
    }
  }

  return (
    <div style={{borderTop: '1px solid #CCC'}}>
      <OverlayTrigger
        key="enable MetaMask"
        placement="right"
        overlay={
          <Tooltip id="button-tooltip" {...props}>
            {tooltipText}
          </Tooltip>
        }
      >
        <Dropdown.Item >
          <div>
            <div style={{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: '12px',
                lineHeight: '18px',
                display: 'flex',
                alignItems: 'center',
                color: '#638298',
                padding: '10px  0px 10px 0px',
             }}>
              Connect to more wallets
            </div>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E0E9EE',
                boxSizing: 'border-box',
                borderRadius: '2px',
                padding: '10px  0px 10px 0px',
              }}
              onClick={e => handleClick(e)}
            >
              {props.parentprops.isAdding
               ? (<div style={{borderRadius: '2px', padding: '0px 10px 0px 10px'}}>
                    <img src={MetaMaskLogo} />
                    &nbsp;
                      Connecting to MetaMask 
                        <span style={{ float: 'right' }}>
                          <img src={connectingAnimation} alt="loading..." width="24" height="24" />
                          &nbsp;
                        </span>
                  </div>)
               : (<div style={{borderRadius: '2px', padding: '0px 10px 0px 10px'}}>
                    <img src={MetaMaskLogo} />
                      Connect to MetaMask
                        <span style={{ float: 'right' }}>
                          &#x2192;
                          &nbsp;
                        </span>
                  </div>)}
            </div>
          </div>
        </Dropdown.Item>
      </OverlayTrigger>
    </div>
  );
}

const Block = styled.div`
  display: block;
`;

function EthAccountDropdownItem(props) {
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');
  const { activeAccount } = useContext(DataContext);

  const account = props.account;

  const handleClick = (e, address) => {
    e.stopPropagation();
    copy(address);
    setTooltipText('Copied!');
    setTimeout(() => {
      setTooltipText('Copy to clipboard');
    }, 2500);
    props.select(account);
  }

  return (
    <div style={ !props.last ? {borderBottom: '1px solid #CCC', padding: '10px 0px 10px 0px'} : {padding: '10px 0px 10px 0px'} }>
      <OverlayTrigger
        key={account.address}
        placement="right"
        overlay={
          <Tooltip id="button-tooltip" key={props.key} account={props.account}>
            {tooltipText}
          </Tooltip>
        }
      >
        <Dropdown.Item onClick={(e) => handleClick(e, account.address)} key={account.address}>
          <Block>
            <div style={{fontWeight: 500, fontSize: '16px', color: '#212529'}}>
              { account.nickname.indexOf('MetaMask') === -1 
                  ? <img src={EmailWalletLogo} />
                  : <img src={MetaMaskLogo}/>
              }
              &nbsp;
                {account.nickname}

              <span style={{ float: 'right' }}>
                <input
                  type="radio"
                  key={account.address}
                  checked={account.address == activeAccount.address}
                  readOnly
                />
              </span>

            </div>
          </Block>
        
          <Block>
            <div style={{fontSize: '12px', color: '#638298', padding: '10px 0px 10px 0px'}}>
              {account.address}
            </div>
          </Block>

          <Block>
            <div style={{ background: '#F7FBFD', borderRadius: '2px', padding: '10px'}}>

              &nbsp;
              <span style={{ float: 'left' }}>
                <GrayDot/>
              </span>

              &nbsp;
              <span style={{ float: 'right' }}>
                {account.balance} TRU
              </span>
            </div>
          </Block>

        </Dropdown.Item>
      </OverlayTrigger>
    </div>
  );
}

const showActiveAccount = (account) => (
  <div style={{ width: '273px' }}>
   
    <div style={{
      fontSize: '14px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      color: '#638298',
    }}>

      {account.nickname}

      <span style={{ float: 'right', color: '#212529', flex: 1, textAlign: 'right', whiteSpace: 'nowrap'}}>
        {shortenAddress(account.address, 6, 4)}
      </span>

    </div>

  </div>
);

function _EthAccountDropdown(props) {
  const { accounts, activeAccount } = useContext(DataContext);

  const [balancesLoading, setBalancesLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadAccountBalances = async () => {
    if (! accounts)
      return;

    for (let i = 0; i < accounts.length; i++) {
      accounts[i].balance = await EthService.getTrustTokenBalance(accounts[i].address);
    }
    setBalancesLoading(false);
  };

  useEffect(() => {
    loadAccountBalances();
  });

  const handleToggle = (newValue, event, {source}) => {
    if (source === 'select') { return; }
    setMenuOpen(newValue);
  };


  return (
    <Dropdown onToggle={handleToggle} show={menuOpen}>
      <Dropdown.Toggle
        as={EthAccountDropdownToggle}
        variant="success"
        id="dropdown-basic"
        disabled={balancesLoading}
      >
        {balancesLoading ? 'Loading...' : <div><GreenDot/>{showActiveAccount(activeAccount)}<DownArrow/></div>}
      </Dropdown.Toggle>

      <Dropdown.Menu>

        {accounts && accounts.map((account, index) => {
          return (
            <div key={index}>
              <EthAccountDropdownItem
                account={account}
                select={account => {
                  props.selectAccount(account);
                }}
                last={index == accounts.length - 1}
              />
            </div>
          );
        })}

        {accounts && accounts.filter(account => account.nickname.indexOf('MetaMask') !== -1).length == 0
         && <EnableMetaMaskDropdownItem parentprops={props} />}

      </Dropdown.Menu>
    </Dropdown>
  );
}

const mapStateToProps = ({ account }) => {
  return {
    isAdding: getIsAdding(account),
    isLoading: getIsLoading(account),
    error: getError(account)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addAccount: addAccount,
      deleteAccount: deleteAccount,
      selectAccount: selectAccount,
      fetchAccounts: fetchAccounts
    },
    dispatch
  )

const EthAccountDropdown = connect(mapStateToProps, mapDispatchToProps)(_EthAccountDropdown);

export { EthAccountDropdown };
