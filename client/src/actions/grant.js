import { EthService } from '@/contracts/EthService';

export const FETCH_GRANTS_PENDING = 'FETCH_GRANTS_PENDING'
export const FETCH_GRANTS_SUCCESS = 'FETCH_GRANTS_SUCCESS'
export const FETCH_GRANTS_ERROR = 'FETCH_GRANTS_ERROR'

function fetchGrantsPending() {
  return {
    type: FETCH_GRANTS_PENDING
  }
}

function fetchGrantsSuccess(payload) {
  return {
    type: FETCH_GRANTS_SUCCESS,
    payload
  }
}

function fetchGrantsError(error) {
  return {
    type: FETCH_GRANTS_ERROR,
    error
  }
}


export function fetchGrants() {
  return async dispatch => {
    console.log("fetchGrants: START");

    dispatch(fetchGrantsPending());

    const account = await EthService.getActiveAccount();
    const amount = await EthService.getTrustTokenBalance(account);
    const start = await EthService.getTrustTokenLockStart();
    const end = await EthService.getTrustTokenFinalEpoch();
    const cliff = await EthService.getTrustTokenNextEpoch();

    const grant = {
      'id': 1,
      'end': end,
      'created_at': start,
      'updated_at': start,
      'purchase_total': null,
      'start': start,
      'amount': amount,
      'purchase_date': start,
      'investment_amount': amount,
      'cancelled': null,
      'purchase_round': null,
      'grant_type': null,
      'cliff': cliff
    };
    dispatch(fetchGrantsSuccess([grant]));

    console.log("fetchGrants: END");

    // TODO: In case of errors:
    //   dispatch(fetchGrantsError(error))
  }
}
