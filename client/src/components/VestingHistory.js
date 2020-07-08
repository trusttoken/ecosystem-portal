import React, { useContext } from 'react'
import moment from 'moment'

import { vestingSchedule } from '@trusttoken/token-transfer-server/src/lib/vesting'

import { DataContext } from '@/providers/data'

const VestingHistory = props => {
  const data = useContext(DataContext)

  // Once we know the actual start date we will update it in the database
  // (start date cannot be null in the database, so we have to enter a 'fake' one initially)
  // and start showing it.
  // For now we show only days from an unspecified start date.
  const showStartDate = false;

  const schedule = {}
  data.grants.forEach(grant => {
    vestingSchedule(props.user, grant).forEach(vest => {
      const dateKey = vest.date.format()
      schedule[dateKey] = {amount: vest.amount, day: vest.day, date: dateKey}
    })
  })

  const tableRows = []
  for (const date of Object.keys(schedule).sort()) {
    const momentDate = moment(date)
    tableRows.push(
      <tr key={date}>
        <td className="pl-0" width="10px">
          <div
            className={`status-circle ${
              momentDate < moment.now() ? `bg-green` : ''
            }`}
          ></div>
        </td>
        <td className="text-nowrap" width="130px">
          <span style={{fontWeight: 500, fontSize: '16px', color: '#212529'}}>
            {Number(schedule[date].amount).toLocaleString()} 
          </span>
          <span className="text-muted">
            &nbsp;
            TRU
          </span>
        </td>
        <td className="d-none d-sm-block">
          <span className="text-muted">
            {momentDate < moment.now() ? 'Unlocked' : 'Locked'}
          </span>
        </td>
        <td >
          <span className="text-muted">
            {
             showStartDate
             ? schedule[date].date.slice(0, -10)
             : "Day " + schedule[date].day
            }
          </span>
        </td>
      </tr>
    )
  }

  return (
    <>
      <h2 className="mb-4">My Unlocking Schedule</h2>
      <hr />
      <div className="table-card">
        <div className="scrolling-table" style={{float: 'left', width: '30%'}}>
          <table className="table mb-0">
            <tbody>
              {data.config.isLocked ? (
                <tr>
                  <td className="table-empty-cell" colSpan="100%">
                    Unlocking has not yet started.
                    <br />
                    Please check back after Lockup Period ends.
                  </td>
                </tr>
              ) : (
                tableRows
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default VestingHistory
