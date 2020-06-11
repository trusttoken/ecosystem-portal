import React, { useContext, useState } from 'react'
import get from 'lodash.get'

import { getNextVest } from '@trusttoken/token-transfer-server/src/shared'

import { DataContext } from '@/providers/data'
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

const Dashboard = props => {
  const data = useContext(DataContext)

  const [displayBonusModal, setDisplayBonusModal] = useState(false)
  const [displayWithdrawModal, setDisplayWithdrawModal] = useState(false)
  const [displayOtcRequestModal, setDisplayOtcRequestModal] = useState(false)

  const isEmployee = !!get(props.user, 'employee')
  const nextVest = getNextVest(data.grants, props.user)
  const hasLockups = data.lockups.length > 0
  const displayLockupCta =
    data.config.earlyLockupsEnabled && !data.config.isLocked
  const displayFullWidthLockupCta = displayLockupCta && hasLockups
  const isEarlyLockup = displayBonusModal === 'early'

  // React.useEffect(() => {
  //   EthService.init('magic');
  // }, []);

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
      {renderModals()}

      <div className="row small-gutter">
        <div className={`${data.config.isLocked ? 'col-12' : 'col'} mb-10`}>
          <BalanceCard
            onDisplayBonusModal={() => setDisplayBonusModal(true)}
            onDisplayWithdrawModal={() => setDisplayWithdrawModal(true)}
          />
        </div>
      </div>
      <div className="row small-gutter">
        <div className="col col-xl-6 mb-10">
          <VestingCard user={props.user} isEmployee={isEmployee} />
        </div>
      </div>
    </>
  )
}

export default Dashboard
