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
  console.log("::: addAccount " + JSON.stringify(account));

  return dispatch => {
    dispatch(addAccountPending());

    console.log("Adding account: " + JSON.stringify(account));

    EthService
      .getTrustTokenBalance(account.address)
      .then(balance => {
        account.balance = balance;
        console.log("Account " + JSON.stringify(account));

        dispatch(addAccountSuccess(account));
        // Once we add an account we automatically select it / make it active.
        dispatch(selectAccountSuccess(account));

        console.log("Adding account " + JSON.stringify(account + " SUCCESSFUL!"));
      })
      .catch(error => {
        console.log("Account " + account.address + " added but failed to retrieve balance: " + JSON.stringify(error));
      })
  }
}

export function deleteAccount(id) {
  return dispatch => {
    // TODO: Do we need a function to delete accounts?
    dispatch(deleteAccountPending());
    dispatch(deleteAccountSuccess(id));
  }
}

export function fetchAccounts() {
  console.log("::: fetchAccounts ");
  return dispatch => {
    dispatch(fetchAccountsPending());

    if (! EthService.state.metamaskInstalled) {
      EthService.enableMetamask()
      .then(enableRes => {
        if (enableRes.code === 4001) {
          console.log("MetaMask NOT enabled.");
          // TODO: dispatch error
          
        } else {
          console.log("MetaMask enabled!");
        }
      });
    }

    const accounts = window.web3.eth.accounts.map(address => ({address: address, nickname: 'MetaMask Wallet', balance: null}));
    console.log("fetchAccounts: " + JSON.stringify(accounts));
    // Fetch balance of the first account, so we can show it immediately.
    if (accounts.length == 0) {
        // TODO: handle error condition better.
        console.log("accounts.length == 0");
        return;
    }
    const selectedAccount = accounts[0];
    EthService
      .getTrustTokenBalance(selectedAccount.address)
      .then(balance => {
        console.log("fetchAccounts: balance of " + selectedAccount + " " + balance);
        selectedAccount.balance = balance;
        dispatch(selectAccountSuccess(selectedAccount));
        dispatch(fetchAccountsSuccess(accounts));
      });
    console.log("::: fetchAccounts END");
  }
}

export function selectAccount(account) {
  return dispatch => {
    dispatch(selectAccountSuccess(account));
  }
}

