import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash.get'

import {
  InvestorTypes,
  RevisedScheduleStatus,
  TransferStatuses
} from '@/lib/enums'

import { DataContext } from '@/providers/data'
import EthAddress from '@/components/EthAddress'

const WithdrawalHistory = ({ history }) => {
  const data = useContext(DataContext)

  console.log(data)

  const accountNicknameMap = {}
  data.accounts.forEach(account => {
    accountNicknameMap[account.address.toLowerCase()] = account.nickname
  })

  return (
    <>
      <div className="row align-items-center">
        <div className="col-12 col-md-4">
          <h1 className="mb-2">History</h1>
        </div>
        <div className="col-12 col-md-2 text-md-right">
          <small>
            <strong>Available </strong>
            {data.config.isLocked
              ? 0
              : Number(data.totals.balance).toLocaleString()}{' '}
            TRU
          </small>
        </div>
        <div className="col-12 col-md-2 text-md-right">
          <small>
            <strong>Withdrawn </strong>
            <span className="text-nowrap">
              {Number(data.totals.withdrawn).toLocaleString()} TRU
            </span>
          </small>
        </div>
        <div className="col-12 col-md-2 text-md-right">
          <small>
            <strong>Locked </strong>
            <span className="text-nowrap">
              {Number(data.totals.unvested).toLocaleString()} TRU
            </span>
          </small>
        </div>
        <div className="col-12 col-md-2 text-md-right">
          <small>
            <strong>Total purchase </strong>
            <span className="text-nowrap">
              {Number(data.totals.granted).toLocaleString()} TRU
            </span>
          </small>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col">
          <div className="table-responsive">
            <table className="table table-borderless table-card-rows table-clickable">
              <thead>
                <tr>
                  <th>Withdrawal Amount</th>
                  <th>IP</th>
                  <th>Destination</th>
                  <th>Nickname</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transfers.length === 0 ? (
                  <tr>
                    <td className="table-empty-cell" colSpan="100%">
                      You have not made any withdrawals.
                    </td>
                  </tr>
                ) : (
                  data.transfers.map(transfer => (
                    <tr
                      key={transfer.id}
                      className="hoverable"
                      onClick={() => history.push(`/withdrawal/${transfer.id}`)}
                    >
                      <td className="pl-4">
                        <strong>
                          {Number(transfer.amount).toLocaleString()}
                        </strong>{' '}
                        <span className="ogn">TRU</span>
                      </td>
                      <td>{get(transfer.data, 'ip', 'Unknown')}</td>
                      <td>
                        <EthAddress address={transfer.toAddress} />
                      </td>
                      <td className="text-nowrap">
                        {accountNicknameMap[transfer.toAddress]}
                      </td>
                      <td className="text-nowrap">
                        {moment(transfer.createdAt).fromNow()}
                      </td>
                      <td className="text-nowrap">
                        {transfer.status ===
                          TransferStatuses.WaitingEmailConfirm &&
                          (moment
                            .utc()
                            .diff(moment(transfer.createdAt), 'minutes') > 5 ? (
                            <>
                              <div className="status-circle bg-red mr-2"></div>
                              Expired
                            </>
                          ) : (
                            <>
                              <div className="status-circle bg-orange mr-2"></div>
                              Email Confirmation
                            </>
                          ))}
                        {[
                          TransferStatuses.Enqueued,
                          TransferStatuses.WaitingConfirmation,
                          TransferStatuses.Processing
                        ].includes(transfer.status) && (
                          <>
                            <div className="status-circle bg-orange mr-2"></div>
                            Processing
                          </>
                        )}
                        {transfer.status === TransferStatuses.Paused && (
                          <>
                            <div className="status-circle bg-red mr-2"></div>
                            Paused
                          </>
                        )}
                        {transfer.status === TransferStatuses.Success && (
                          <>
                            <div className="status-circle bg-green mr-2"></div>
                            Confirmed
                          </>
                        )}
                        {transfer.status === TransferStatuses.Failed && (
                          <>
                            <div className="status-circle bg-red mr-2"></div>
                            Failed
                          </>
                        )}
                        {[
                          TransferStatuses.Expired,
                          TransferStatuses.Cancelled
                        ].includes(transfer.status) && (
                          <>
                            <div className="status-circle bg-red mr-2"></div>
                            {transfer.status}
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(WithdrawalHistory)
