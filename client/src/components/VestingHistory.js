import React, { useContext } from 'react'
import moment from 'moment'

import { vestingSchedule } from '@trusttoken/token-transfer-server/src/lib/vesting'

import { DataContext } from '@/providers/data'

const VestingHistory = props => {
  const data = useContext(DataContext)

  const schedule = {}
  data.grants.forEach(grant => {
    vestingSchedule(props.user, grant).forEach(vest => {
      const dateKey = vest.date.format()
      schedule[dateKey] = vest.day;
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
          {Number(schedule[date]).toLocaleString()} TRU
        </td>
        <td className="d-none d-sm-block">
          <span className="text-muted">
            {momentDate < moment.now() ? 'Unlocked' : 'Locked'}
          </span>
        </td>
        <td className="text-right">Day {schedule[date]}</td>
      </tr>
    )
  }

  return (
    <>
      <h2 className="mb-4">My Unlocking Schedule</h2>
      <hr />
      <div className="table-card">
        <div className="scrolling-table">
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
