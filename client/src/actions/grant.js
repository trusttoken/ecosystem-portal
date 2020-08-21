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

    try {
      const grant = await EthService.loadGrant();
      dispatch(fetchGrantsSuccess([grant]));
      console.log("fetchGrants: END");
    } catch (error) {
      dispatch(fetchGrantsError(error))
    }
  }
}
