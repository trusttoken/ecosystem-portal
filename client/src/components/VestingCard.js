import React, { useContext } from 'react'

import { DataContext } from '@/providers/data'
import BorderedCard from '@/components/BorderedCard'
import VestingBars from '@/components/VestingBars'
import VestingHistory from '@/components/VestingHistory'
import VestingSchedule from '@/assets/schedule@3x.png'

const VestingCard = () => {
  const data = useContext(DataContext)

  return (
    <BorderedCard style={{ minHeight: '100%' }}>
      <VestingBars />
      {false ? ( //data.config.isLocked ? (
          <>
            <h2>Revised Unlocking Schedule</h2>
            <p>
              The purple line shows the proposed amendment to the token release
              schedule.
            </p>
            <img src={VestingSchedule} className="img-fluid mx-auto mt-2" />
          </>
      ) : (
        <VestingHistory />
      )}
    </BorderedCard>
  )
}

export default VestingCard
