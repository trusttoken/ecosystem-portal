import React, { useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import Dropdown from 'react-bootstrap/Dropdown'
import moment from 'moment'

import { DataContext } from '@/providers/data'
import BorderedCard from '@/components/BorderedCard'
import DropdownDotsToggle from '@/components/DropdownDotsToggle'
import LockupDescModal from '@/components/modal/LockupDescModal'

const BalanceCard = ({ onDisplayBonusModal, onDisplayWithdrawModal }) => {
  const data = useContext(DataContext)

  const [redirectTo, setRedirectTo] = useState(false)
  const [displayLockupDescModal, setDisplayLockupDescModal] = useState(false)

  const doughnutData = () => {
    return {
      labels: ['Available', 'Locked'],
      datasets: [
        {
          data: [Number(data.totals.balance), Number(data.totals.locked)],
          backgroundColor: ['#00db8d', '#061439'],
          borderWidth: 0
        }
      ]
    }
  }

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
            <>
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
            </>
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
    <>
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
        <div className="row header mb-3">
          <div className="col">
            <h2>My Unlocked Tokens</h2>
          </div>
        </div>
        <div className="row">
          {data.config.lockupsEnabled &&
            (data.totals.balance > 0 || data.totals.locked > 0) && (
              <div
                className="col-12 col-lg-4 mb-4 mb-lg-0 mx-auto"
                style={{ maxWidth: '200px' }}
              >
                <div style={{ position: 'relative' }}>
                  <Doughnut
                    height={100}
                    width={100}
                    data={doughnutData}
                    options={{ cutoutPercentage: 70 }}
                    legend={{ display: false }}
                  />
                </div>
              </div>
            )}
          <div className="col">
            <div className="row">
              {data.config.lockupsEnabled && (
                <div className="col-1 text-right">
                  <div className="status-circle bg-green"></div>
                </div>
              )}
              <div className="col text-nowrap">
                <div>Available</div>
                <div
                  className="mr-1 mb-3 d-inline-block font-weight-bold"
                  style={{ fontSize: '32px' }}
                >
                  {data.config.isLocked
                    ? 0
                    : Number(data.totals.balance).toLocaleString()}{' '}
                </div>
                <span className="ogn">TRU</span>
              </div>
              <div className="col-1 text-right">
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
              </div>
            </div>
          </div>
        </div>
      </BorderedCard>
    </>
  )
}

export default BalanceCard
