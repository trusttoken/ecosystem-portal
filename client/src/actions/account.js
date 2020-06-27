import agent from '@/utils/agent'
import { apiUrl } from '@/constants'
import { EthService } from '@/contracts/EthService';

export const ADD_ACCOUNT_PENDING = 'ADD_ACCOUNT_PENDING'
export const ADD_ACCOUNT_SUCCESS = 'ADD_ACCOUNT_SUCCESS'
export const ADD_ACCOUNT_ERROR = 'ADD_ACCOUNT_ERROR'
export const DELETE_ACCOUNT_PENDING = 'DELETE_ACCOUNT_PENDING'
export const DELETE_ACCOUNT_SUCCESS = 'DELETE_ACCOUNT_SUCCESS'
export const DELETE_ACCOUNT_ERROR = 'DELETE_ACCOUNT_ERROR'
export const FETCH_ACCOUNTS_PENDING = 'FETCH_ACCOUNTS_PENDING'
export const FETCH_ACCOUNTS_SUCCESS = 'FETCH_ACCOUNTS_SUCCESS'
export const FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR'
export const SELECT_ACCOUNT_SUCCESS = 'SELECT_ACCOUNT_SUCCESS'

function addAccountPending() {
  return {
    type: ADD_ACCOUNT_PENDING
  }
}

function addAccountSuccess(payload) {
  return {
    type: ADD_ACCOUNT_SUCCESS,
    payload
  }
}

function addAccountError(error) {
  return {
    type: ADD_ACCOUNT_ERROR,
    error
  }
}

function deleteAccountPending() {
  return {
    type: DELETE_ACCOUNT_PENDING
  }
}

function deleteAccountSuccess(payload) {
  return {
    type: DELETE_ACCOUNT_SUCCESS,
    payload
  }
}

function deleteAccountError(error) {
  return {
    type: DELETE_ACCOUNT_ERROR,
    error
  }
}

function fetchAccountsPending() {
  return {
    type: FETCH_ACCOUNTS_PENDING
  }
}

function uniqueAccounts(accounts) {
  let addresses = new Set();
  let uniqueAccounts = [];

  accounts.map(account => {
    if (! addresses.has(account.address)) {
       addresses.add(account.address);
       uniqueAccounts.push(account);
    }
  });
  return uniqueAccounts;
}

function fetchAccountsSuccess(payload) {
  return {
    type: FETCH_ACCOUNTS_SUCCESS,
    payload
  }
}

function selectAccountSuccess(payload) {
  return {
    type: SELECT_ACCOUNT_SUCCESS,
    payload
  }
}

function fetchAccountsError(error) {
  return {
    type: FETCH_ACCOUNTS_ERROR,
    error
  }
}

export function addAccount(account) {
  return dispatch => {
    dispatch(addAccountPending())

    return agent
      .post(`${apiUrl}/api/accounts`)
      .send(account)
      .then(response => dispatch(addAccountSuccess(response.body)))
      .catch(error => {
        dispatch(addAccountError(error))
        throw error
      })
  }
}

export function deleteAccount(id) {
  return dispatch => {
    dispatch(deleteAccountPending())

    return agent
      .delete(`${apiUrl}/api/accounts/${id}`)
      .then(() => dispatch(deleteAccountSuccess(id)))
      .catch(error => {
        dispatch(deleteAccountError(error))
        throw error
      })
  }
}

function _enableMagicLinkWalletAddress(dispatch) {
  EthService.getMagicLinkWalletAddress()
    .then((magicLinkWalletAddress) => {
      const magicLinkAccount = {
        nickname: 'Magic Link Wallet',
        address: magicLinkWalletAddress,
      };
      agent.post(`${apiUrl}/api/accounts`)
        .send(magicLinkAccount)
        .then(response => {
          dispatch(fetchAccountsSuccess([response.body]));
        });
    });
}

export function fetchAccounts() {
  return dispatch => {
    dispatch(fetchAccountsPending())

    return agent
      .get(`${apiUrl}/api/accounts`)
      .then(response => {
        if (response.body.length === 0) {
            _enableMagicLinkWalletAddress(dispatch);
        } else {
          // I was getting duplicated accounts from server so calling
          // uniqueAccounts here fixed the problem.
          // TODO: We should check in /api/accounts POST endpoint for duplicated accounts.
          const accounts = uniqueAccounts(response.body);
          // Fetch balance of the first account, so we can show it immediately.
          const selectedAccount = accounts[0];
          EthService
            .getMagicLinkWalletTrustTokenBalance(selectedAccount.address)
            .then(balance => {
              selectedAccount.balance = balance;
              dispatch(selectAccountSuccess(selectedAccount));
              dispatch(fetchAccountsSuccess(accounts));
            });
        }
      })
      .catch(error => {
        dispatch(fetchAccountsError(error))
        if (error.status !== 401) {
          throw error
        }
      })
  }
}

export function selectAccount(account) {
  return dispatch => {
    dispatch(selectAccountSuccess(account))
  }
}

