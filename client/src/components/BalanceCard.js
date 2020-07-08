import React, { useContext, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import Dropdown from 'react-bootstrap/Dropdown'
import moment from 'moment'

import { DataContext } from '@/providers/data';
import BorderedCard from '@/components/BorderedCard'
import DropdownDotsToggle from '@/components/DropdownDotsToggle'
import LockupDescModal from '@/components/modal/LockupDescModal'
import { EthService } from '@/contracts/EthService';

import { selectAccount } from '@/actions/account'
import { getActiveAccount } from '@/reducers/account'

import MetaMaskLogo from '@/assets/metamask_small.png';
import EmailWalletIcon from '@/assets/email_wallet.svg'
import CustodianWalletIcon from '@/assets/custodial-wallet_icon.svg'
import CustodianWalletPNG from '@/assets/custodial-wallet_icon-1x.png'

import TokenStackIcon from '@/assets/token-stack.svg';

import QuestionIcon from '@/assets/question.svg';


const WalletInfo = ({account, logo}) => {
  return (
      <div style={{
          padding: '10px',
          fontSize: '14px',
          lineHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          color: '#638298'
      }}>
        <div style={{paddingRight: '10px'}}>
          {logo} 
        </div>

        {account && account.nickname}:
        &nbsp;
        <div style={{color: '#212529', fontWeight: 500}}>
          {account && (account.balance / 100000000)}
        </div>
        &nbsp;
        TRU
      </div>
  );
}

const _BalanceCard = ({ activeAccount, onDisplayBonusModal, onDisplayWithdrawModal }) => {
  const data = useContext(DataContext);
  const [redirectTo, setRedirectTo] = useState(false)
  const [displayLockupDescModal, setDisplayLockupDescModal] = useState(false)
  const [tooltipText, setTooltipText] = useState('Copy to clipboard');

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  if (data.config.isLocked) {
    const now = moment.utc()
    return (
      <BorderedCard>
        <div className="row">
          {data.config.unlockDate &&
          moment(data.config.unlockDate).isValid() ? (
            <div>
              <div className="col-12 col-lg-6 my-4">
                <h1 className="mb-1">Your tokens are almost here!</h1>
                <span style={{ fontSize: '18px' }}>
                  Your first tokens will be available in...
                </span>
              </div>
              <div className="col-12 col-lg-6" style={{ alignSelf: 'center' }}>
                <div className="bluebox p-2 text-center">
                  {moment(data.config.unlockDate).diff(now, 'days')}d{' '}
                  {moment(data.config.unlockDate).diff(now, 'hours') % 24}h{' '}
                  {moment(data.config.unlockDate).diff(now, 'minutes') % 60}m
                </div>
              </div>
            </div>
          ) : (
            <div className="col">
              <div className="bluebox p-2 text-center">
                Tokens Unlocking Soon
              </div>
            </div>
          )}
        </div>
      </BorderedCard>
    )
  }

  return (
    <div>
      {displayLockupDescModal && (
        <LockupDescModal
          handleModalClose={() => setDisplayLockupDescModal(false)}
          onEarnBonusClick={() => {
            setDisplayLockupDescModal(false)
            onDisplayBonusModal()
          }}
        />
      )}
      <BorderedCard>
        <div className="row">
          <div style={{display: 'block', padding: '10px'}}>
            <TokenStackIcon />
          </div>
          <div className="col text-nowrap">
            <div style={{ fontWeight: 'normal', fontSize: '14px', lineHeight: '20px', display: 'flex', alignItems: 'center', color: '#638298' }}>
              <div style={{display: 'inline'}}>
                Available TrustTokens
                &nbsp;
              </div>
              <div style={{display: 'inline'}}>
                { /** Hiding this for now, help text not approved yet.
                <QuestionIcon />
                */
                }
              </div>
            </div>
            {/**/}
            <div className="mr-1 mb-3 d-inline-block font-weight-bold" style={{ fontSize: '32px' }} >
              {
                  /* TODO: need to get balance of custodial wallet and add it to the formula */
                  activeAccount && activeAccount.balance && (activeAccount.balance / 100000000)
              }
            </div>
            <span className="ogn">&nbsp; TRU</span>
          </div>
          <div className="col-1 text-right">
            { /* TODO: Withdraw & Withdrawal History not implemented yet, show hanburger menu when ready.
            <Dropdown drop={'left'} style={{ display: 'inline' }}>
              <Dropdown.Toggle
                as={DropdownDotsToggle}
                id="available-dropdown"
              ></Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={onDisplayWithdrawModal}>
                  Withdraw
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setRedirectTo('/withdrawal')}>
                  Withdrawal History
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            */
            }
          </div>
        </div>

        <div className="row" style={{borderTop: "solid 1px", borderColor: '#E0E9EE'}}>
          <WalletInfo
            account={activeAccount}
            logo={ activeAccount.nickname.indexOf('MetaMask') !== -1 ? <img src={MetaMaskLogo} /> : <EmailWalletIcon/> }
          />

          &nbsp;

          <WalletInfo
            account={{nickname: "Custodial Wallet", balance: 0}}
            logo=<img src={CustodianWalletPNG}/>
          />
        </div>

      </BorderedCard>
    </div>
  )
}


const mapStateToProps = ({ account }) => {
  return {
    activeAccount: getActiveAccount(account),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectAccount: selectAccount,
    },
    dispatch
  )

const BalanceCard = connect(mapStateToProps, mapDispatchToProps)(_BalanceCard);
export default BalanceCard
