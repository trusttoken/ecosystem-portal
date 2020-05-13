import React, { useState, useContext } from 'react';
import { DataContext } from '@/providers/data';
import { Redirect } from 'react-router-dom';

import UnlockSchedule from '@/assets/schedule@3x.png';
import VestingScheudle from '@/assets/vesting_schedule.png'

const RevisedSchedule = (props) => {
  console.log(props);
  const data = useContext(DataContext);
  console.log(data);

  const [redirectTo, setRedirectTo] = useState(null)

  if (redirectTo) {
    return <Redirect push to={redirectTo} />
  }

  return (
    <>
      <div className="action-card wide">
        <h1>Revised Token Unlock Schedule</h1>
        <p>
          Multiple exchanges that we are partnering with to list TrustToken Tokens (TRU)
          have required us to modify our token release schedule. These amendments
          have been approved by our largest SAFT purchasers, including Blocktower Capital,
          a16z crypto, Foundation Capital, Danhua Capital, and dozens of other funds and individuals.
        </p>
        <p>
          Revised Schedule: 1 token unlocked immediately, followed by a 4-month lockup, then the remainder unlocking quarterly over the next 2 years.
        </p>
        <img className="img-fluid my-4" src={VestingScheudle} />
        <h2 className="mb-3">Why is this necessary?</h2>
        <p>
          TrustToken, our top purchasers, and our exchange partners all believe that having a
          more gradual release is to the benefit of all stakeholders and token holders.
          The new release schedule has been designed to foster long-term community growth and participation.
        </p>
        <button
          className="btn btn-primary btn-lg mt-5"
          onClick={() => setRedirectTo('/revised_terms')}
        >
          View Agreement
        </button>
      </div>
    </>
  )
}

export default RevisedSchedule
