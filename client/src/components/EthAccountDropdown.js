import React, { useContext, useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import styled from 'styled-components';
import copy from 'copy-to-clipboard';

import { EthService } from '@/contracts/EthService';

import { shortenAddress } from '@/lib/account';

import { DataContext } from '@/providers/data';
//import { ActiveAccountContext } from '@/providers/activeaccountcontext';


import { addAccount, deleteAccount } from '@/actions/account'
import { getError, getIsAdding, getIsLoading } from '@/reducers/account'

const GreenDot = styled.div`
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #00DB8D;
  border-radius: 50%;
  margin-right: 8px;
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

              console.log(window.web3.eth.accounts);
              const accounts = window.web3.eth.accounts;
              console.log('MetaMask accounts:', JSON.stringify(accounts));

              if (accounts.length === 0) {
                console.log("No MetaMask account!?");
              } else {
                console.log("Adding MetaMask account " + JSON.stringify(accounts[0]));
                const result = await props.parentprops.addAccount({
                  nickname: "MetaMask Wallet",
                  address: accounts[0]
                });
              }
          }
        })();
    }

    setTooltipText(EthService.state.metamaskInstalled ? 'Detected MetaMask.' : 'Install MetaMask plugin.');
    setTimeout(() => {
      setTooltipText(EthService.state.metamaskInstalled ? 'Use your MetaMask wallet' : 'Go to MetaMask installation page');
    }, 2500);
  }

  return (
    <OverlayTrigger
      key="enable MetaMask"
      placement="right"
      overlay={
        <Tooltip id="button-tooltip" {...props}>
          {tooltipText}
        </Tooltip>
      }
    >
      <Dropdown.Item onClick={e => handleClick(e)}>
        <div>Connect to MetaMask wallet</div>
      </Dropdown.Item>
    </OverlayTrigger>
  );
}


function EthAccountDropdownItem(props) {
  const account = props.account;

  const [truBalance, setTruBalance] = useState(null);
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');

  const { activeAccount, setActiveAccount } = useContext(DataContext);

  useEffect(() => {
      EthService.getMagicLinkWalletTrustTokenBalance(account.address)
        .then((balance) => {
            setTruBalance(balance);
        });
  }, []);

  const handleClick = (e, address) => {
    e.stopPropagation();
    copy(address);
    setTooltipText('Copied!');
    setTimeout(() => {
      setTooltipText('Copy to clipboard');
    }, 2500);
    props.select(account);
    setActiveAccount(account);
  }

  return (
    <OverlayTrigger
      key={account.address}
      placement="right"
      overlay={
        <Tooltip id="button-tooltip" key={props.key} account={props.account}>
          {tooltipText}
        </Tooltip>
      }
    >
      <Dropdown.Item onClick={(e) => handleClick(e, account.address)}  >
        <div>{account.nickname}</div>
        <div>{account.address}</div>
        <div>
          {account.balance / 100000000} TRU
        </div>
      </Dropdown.Item>
    </OverlayTrigger>
  );
}


function _EthAccountDropdown(props) {
  const { accounts, activeAccount, setActiveAccount } = useContext(DataContext);
  console.log("==== activeAccount " + JSON.stringify(activeAccount));

  const [dropdownToggleText, setDropdownToggleText] = useState('');
  const [balancesLoading, setBalancesLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadAccountBalances = async () => {
    for (let i = 0; i < accounts.length; i++) {
      const balance = await EthService.getMagicLinkWalletTrustTokenBalance(accounts[i].address);
      accounts[i].balance = balance;
    }
    setBalancesLoading(false);
    if (! activeAccount || ! activeAccount.address) {
        setActiveAccount(accounts[0]);
        showActiveAccount(accounts[0]);
    }
  };

  useEffect(() => {
    loadAccountBalances();
  });

  function showActiveAccount(account) {
    const shortenedAddress = shortenAddress(account.address, 6, 4);
    setDropdownToggleText(`${account.nickname} ${shortenedAddress}`);
  }

  if (!dropdownToggleText && activeAccount) {
    showActiveAccount(activeAccount);
  }

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
        {balancesLoading ? 'Loading...' : <div><GreenDot/>{dropdownToggleText}<DownArrow/></div>}
      </Dropdown.Toggle>

      <Dropdown.Menu>

        {accounts && accounts.map(account => {
          return (
            <EthAccountDropdownItem
              key={account.address}
              account={account}
              select={showActiveAccount}
            />
          );
        })}

        {accounts && accounts.filter(account => account.nickname == "MetaMask Wallet").length == 0
          &&  <EnableMetaMaskDropdownItem parentprops={props} />}

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
      deleteAccount: deleteAccount
    },
    dispatch
  )

const EthAccountDropdown = connect(mapStateToProps, mapDispatchToProps)(_EthAccountDropdown);

export { EthAccountDropdown };
