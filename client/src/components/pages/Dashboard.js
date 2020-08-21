import React, { useContext, useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';

import get from 'lodash.get'

import { getNextVest } from '@/lib/shared'

import BalanceCard from '@/components/BalanceCard'
import NewsHeadlinesCard from '@/components/NewsHeadlinesCard'
import VestingCard from '@/components/VestingCard'
import GrantDetailCard from '@/components/GrantDetailCard'
import WithdrawalSummaryCard from '@/components/WithdrawalSummaryCard'
import BonusCard from '@/components/BonusCard'
import BonusModal from '@/components/BonusModal'
import BonusCta from '@/components/BonusCta'
import WithdrawModal from '@/components/WithdrawModal'
import OtcRequestModal from '@/components/OtcRequestModal'
import { EthService } from '@/contracts/EthService';
import { fetchGrants } from '@/actions/grant';


const Dashboard = props => {

  const [displayBonusModal, setDisplayBonusModal] = useState(false)
  const [displayWithdrawModal, setDisplayWithdrawModal] = useState(false)
  const [displayOtcRequestModal, setDisplayOtcRequestModal] = useState(false)
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    (async () => {
      const grant = await EthService.loadGrant();
      setGrants([grant]);
    })();
  }, []);

  const nextVest = getNextVest(grants)
  const isEarlyLockup = displayBonusModal === 'early'

  const renderModals = () => (
    <>
      {displayBonusModal && (
        <BonusModal
          nextVest={nextVest}
          isEarlyLockup={isEarlyLockup}
          onModalClose={() => setDisplayBonusModal(false)}
        />
      )}
      {displayWithdrawModal && (
        <WithdrawModal
          displayLockupCta={false} // For future use
          onCreateOtcRequest={() => {
            setDisplayWithdrawModal(false)
            setDisplayOtcRequestModal(true)
          }}
          nextVest={nextVest}
          onCreateLockup={() => {
            setDisplayWithdrawModal(false)
            setDisplayBonusModal('early')
          }}
          onModalClose={() => setDisplayWithdrawModal(false)}
        />
      )}
      {displayOtcRequestModal && (
        <OtcRequestModal
          onModalClose={() => setDisplayOtcRequestModal(false)}
        />
      )}
    </>
  )

  return (
    <>
      { /* renderModals() */ }
      <div className="row small-gutter">
        <div className="col col-xl-12 mb-10">
          <VestingCard grants={grants} />
        </div>
      </div>
    </>
  )
}

export default Dashboard
