import React, { createContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchAccounts } from '@/actions/account'
import {
  getAccounts,
  getActiveAccount,
  getIsLoading as getAccountIsLoading
} from '@/reducers/account'
import { fetchConfig } from '@/actions/config'
import {
  getConfig,
  getIsLoading as getConfigIsLoading
} from '@/reducers/config'
import { fetchGrants } from '@/actions/grant'
import {
  getGrants,
  getIsLoading as getGrantIsLoading,
  getTotals as getGrantTotals
} from '@/reducers/grant'
import { fetchLockups } from '@/actions/lockup'
import {
  getLockups,
  getIsLoading as getLockupIsLoading,
  getTotals as getLockupTotals
} from '@/reducers/lockup'
import { fetchTransfers } from '@/actions/transfer'
import {
  getTransfers,
  getIsLoading as getTransferIsLoading,
  getWithdrawn
} from '@/reducers/transfer'
import { EthService } from '@/contracts/EthService';

import styled from 'styled-components';

const Centered = styled.div`
  text-align: center;
`;


export const DataContext = createContext()

const _DataProvider = ({ children, ...rest }) => {
  useEffect(() => {
    rest.fetchAccounts(),
      rest.fetchConfig(),
      rest.fetchGrants(),
      rest.fetchLockups(),
      rest.fetchTransfers()
  }, [])

  if (
    rest.accountIsLoading ||
    rest.configIsLoading ||
    rest.transferIsLoading ||
    rest.grantIsLoading ||
    rest.lockupIsLoading
  ) {
    return (
    <>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      { EthService.networkIdToNetworkName(web3.version.network) != EthService.getEthNetwork()
        ? <Centered>
            Your MetaMask wallet is connected to Ethereum network <b>{EthService.networkIdToNetworkName(web3.version.network)}</b>.
            <br/>

            Please connect to <b>{EthService.getEthNetwork()}</b>.
          </Centered>
        : null
      }
    </>
    )
  }

  // Calculate balances
  const balance = rest.grantTotals.vested
    // Subtract any withdrawn
    .minus(rest.withdrawn)
    // Subtract any locked tokens
    .minus(rest.lockupTotals.locked)
    // Earnings from lockups that are unlocked
    .plus(rest.lockupTotals.unlockedEarnings)

  const configOverrides = window.localStorage.configOverrides
    ? JSON.parse(window.localStorage.configOverrides)
    : {}

  const value = {
    activeAccount: rest.activeAccount,
    accounts: rest.accounts,
    config: {
      ...rest.config,
      ...configOverrides
    },
    lockups: rest.lockups,
    grants: rest.grants,
    transfers: rest.transfers,
    totals: {
      ...rest.grantTotals,
      ...rest.lockupTotals,
      withdrawn: rest.withdrawn,
      balance
    }
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

const mapStateToProps = ({
  account,
  config,
  grant,
  lockup,
  transfer,
}) => {
  return {
    activeAccount: getActiveAccount(account),
    accounts: getAccounts(account),
    config: getConfig(config),
    grants: getGrants(grant),
    lockups: getLockups(lockup),
    transfers: getTransfers(transfer),
    accountIsLoading: getAccountIsLoading(account),
    configIsLoading: getConfigIsLoading(config),
    grantIsLoading: getGrantIsLoading(grant),
    lockupIsLoading: getLockupIsLoading(lockup),
    transferIsLoading: getTransferIsLoading(transfer),
    withdrawn: getWithdrawn(transfer),
    grantTotals: getGrantTotals(grant),
    lockupTotals: getLockupTotals(lockup)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchAccounts: fetchAccounts,
      fetchConfig: fetchConfig,
      fetchGrants: fetchGrants,
      fetchLockups: fetchLockups,
      fetchTransfers: fetchTransfers
    },
    dispatch
  )

export const DataProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(_DataProvider)
