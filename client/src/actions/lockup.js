
export const ADD_LOCKUP_PENDING = 'ADD_LOCKUP_PENDING'
export const ADD_LOCKUP_SUCCESS = 'ADD_LOCKUP_SUCCESS'
export const ADD_LOCKUP_ERROR = 'ADD_LOCKUP_ERROR'
export const CONFIRM_LOCKUP_PENDING = 'CONFIRM_LOCKUP_PENDING'
export const CONFIRM_LOCKUP_SUCCESS = 'CONFIRM_LOCKUP_SUCCESS'
export const CONFIRM_LOCKUP_ERROR = 'CONFIRM_LOCKUP_ERROR'
export const FETCH_LOCKUPS_PENDING = 'FETCH_LOCKUPS_PENDING'
export const FETCH_LOCKUPS_SUCCESS = 'FETCH_LOCKUPS_SUCCESS'
export const FETCH_LOCKUPS_ERROR = 'FETCH_LOCKUPS_ERROR'

function addLockupPending() {
  return {
    type: ADD_LOCKUP_PENDING
  }
}

function addLockupSuccess(payload) {
  return {
    type: ADD_LOCKUP_SUCCESS,
    payload
  }
}

function addLockupError(error) {
  return {
    type: ADD_LOCKUP_ERROR,
    error
  }
}

function confirmLockupPending() {
  return {
    type: CONFIRM_LOCKUP_PENDING
  }
}

function confirmLockupSuccess(payload) {
  return {
    type: CONFIRM_LOCKUP_SUCCESS,
    payload
  }
}

function confirmLockupError(error) {
  return {
    type: CONFIRM_LOCKUP_ERROR,
    error
  }
}

function fetchLockupsPending() {
  return {
    type: FETCH_LOCKUPS_PENDING
  }
}

function fetchLockupsSuccess(payload) {
  return {
    type: FETCH_LOCKUPS_SUCCESS,
    payload
  }
}

function fetchLockupsError(error) {
  return {
    type: FETCH_LOCKUPS_ERROR,
    error
  }
}


const sampleLockup = {
  "amount": 100000000000,
  "bonus_rate": 0.1,
  "confirmed": true,
  "created_at": "2020-06-02 18:29:38.997429+00",
  "data": null,
  "end": "2022-06-02 18:29:38.997429+00",
  "id": 1,
  "start": "2020-06-02 18:29:38.997429+00",
  "updated_at": "2020-06-02 18:29:38.997429+00",
  "user_id": 1
};


export function addLockup(lockup) {
  return dispatch => {
    dispatch(addLockupPending());
    dispatch(addLockupSuccess(sampleLockup));

    //return agent
    //  .post(`${apiUrl}/api/lockups`)
    //  .send(lockup)
    //  .then(response => dispatch(addLockupSuccess(response.body)))
    //  .catch(error => {
    //    dispatch(addLockupError(error))
    //    throw error
    //  })
  }
}


export function fetchLockups() {
  console.log("::: fetchLockups");

  return dispatch => {
    console.log("::: fetchLockups BEGIN");

    dispatch(fetchLockupsPending());
    dispatch(fetchLockupsSuccess([sampleLockup]));

    console.log("::: fetchLockups END");

    //agent
    //  .get(`${apiUrl}/api/lockups`)
    //  .then(response => dispatch(fetchLockupsSuccess(response.body)))
    //  .catch(error => {
    //    dispatch(fetchLockupsError(error))
    //    if (error.status !== 401) {
    //      throw error
    //    }
    //  })
  }
}

export function confirmLockup(id, token) {
  return dispatch => {
    dispatch(confirmLockupPending())
    // TODO:
    const data = sampleLockup;
    dispatch(confirmLockupSuccess(data));

    //return agent
    //  .post(`${apiUrl}/api/lockups/${id}`)
    //  .send({ token })
    //  .then(response => dispatch(confirmLockupSuccess(response.body)))
    //  .catch(error => {
    //    dispatch(confirmLockupError(error))
    //    throw error
    //  })
  }
}
