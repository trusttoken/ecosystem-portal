
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
  return dispatch => {
    console.log("fetchGrants: START");

    dispatch(fetchGrantsPending());

    // TODO: Retrieve from TT smart contract, for now a mock.
    const grant = {
      'id': 1,
      'user_id': 1,
      'end': '2022-06-02',
      'created_at': '2020-06-02 18:29:38.997429+00',
      'updated_at': '2020-06-02 18:29:38.997429+00',
      'purchase_total': null,
      'start': '2020-06-02',
      'amount': '1000000000',
      'purchase_date': '2020-06-02',
      'investment_amount': 100000000,
      'cancelled': null,
      'purchase_round': null,
      'grant_type': null,
      'cliff': '2020-11-02'
    };
    dispatch(fetchGrantsSuccess([grant]));

    console.log("fetchGrants: END");

    // TODO: In case of errors:
    //   dispatch(fetchGrantsError(error))
  }
}
