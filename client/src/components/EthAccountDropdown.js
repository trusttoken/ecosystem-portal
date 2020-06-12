import React, { useContext, useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { EthService } from '@/contracts/EthService';

import { shortenAddress } from '@/lib/account';

import { DataContext } from '@/providers/data';

function renderTooltip(props) {
  console.log('ttProps', props);
  return (
    <Tooltip id="button-tooltip" {...props}>
      {props.tooltipText}
    </Tooltip>
  );
}

function EthAccountDropdownItem(props) {
  const account = props.account;

  const [truBalance, setTruBalance] = useState(null);
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');

  useEffect(() => {
    EthService.getMagicLinkWalletTrustTokenBalance(account.address)
      .then((balance) => {
        if (truBalance === null) {
          setTruBalance(balance);
        }
      });
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setTooltipText('Copied!');
    setTimeout(() => {
      setTooltipText('Copy to clipboard');
    }, 2500);
  }

  return (
    <OverlayTrigger
      key={account.address}
      placement="right"
      overlay={
        <Tooltip id="button-tooltip" {...props}>
          {tooltipText}
        </Tooltip>
      }
    >
      <Dropdown.Item onClick={handleClick}>
        <div>{account.nickname}</div>
        <div>{account.address}</div>
        <div>
          {account.balance / 100000000} TRU
        </div>
      </Dropdown.Item>
    </OverlayTrigger>
  );
}

function EthAccountDropdown(props) {
  const data = useContext(DataContext);
  const accounts = data.accounts;
  console.log('EAD data', data);

  const [dropdownToggleText, setDropdownToggleText] = useState('');
  const [balancesLoading, setBalancesLoading] = useState(true);

  const loadAccountBalances = async () => {
    for (let i = 0; i < accounts.length; i++) {
      const balance = await EthService.getMagicLinkWalletTrustTokenBalance(accounts[i].address);
      accounts[i].balance = balance;
    }
    setBalancesLoading(false);
  };

  useEffect(() => {
    loadAccountBalances();
  });

  if (!dropdownToggleText && accounts && accounts[0]) {
    const shortenedAddress = shortenAddress(accounts[0].address, 6, 4);
    setDropdownToggleText(`${data.accounts[0].nickname} ${shortenedAddress}`);
  }

  return (
    <Dropdown onSelect={(e) => e.stopPropagation()}>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        disabled={balancesLoading}
      >
        {balancesLoading ? 'Loading...' : dropdownToggleText}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {accounts && accounts.map((account) => {
          return (
            <EthAccountDropdownItem account={account} />
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export { EthAccountDropdown };
