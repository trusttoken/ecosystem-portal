import React, { useContext } from 'react'
import moment from 'moment'

import { vestingSchedule } from '@/lib/vesting';

import { DataContext } from '@/providers/data'

const VestingHistory = ({grants}) => {
  //const data = useContext(DataContext)

  const showStartDate = true;

  const schedule = {}
  grants.forEach(grant => {
    vestingSchedule(grant).forEach(vest => {
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
            {Number(schedule[date].amount).toLocaleString("en-US", {style: "decimal", maximumFractionDigits: 5}) } 
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
      <h2 className="mb-4">Unlocking Schedule</h2>
      <hr />
      <div className="table-card">
        <div style={{width: '100%'}}>
          <table className="table mb-0">
            <tbody>
              {false ? ( // data.config.isLocked ? (
                <tr>
                  <td className="table-empty-cell" colSpan="100%">
                    Unlocking has not yet started.
                    <br />
                    Please check back after Lockup Period ends.
                  </td>
                </tr>
              ) : (
                  <tr>
                    <td>
                      <table className="table mb-0">
                        <tbody>
                          {tableRows.splice(0, Math.ceil(tableRows.length / 2))}
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table className="table mb-0">
                        <tbody>
                          {tableRows.splice(Math.ceil(tableRows.length / 2) - 2)}
                        </tbody>
                      </table>
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default VestingHistory
