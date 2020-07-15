
export const EDIT_USER_PENDING = 'EDIT_USER_PENDING'
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS'
export const EDIT_USER_ERROR = 'EDIT_USER_ERROR'
export const FETCH_USER_PENDING = 'FETCH_USER_PENDING'
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS'
export const FETCH_USER_ERROR = 'FETCH_USER_ERROR'

function editUserPending() {
  return {
    type: EDIT_USER_PENDING
  }
}

function editUserSuccess(payload) {
  return {
    type: EDIT_USER_SUCCESS,
    payload
  }
}

function editUserError(error) {
  return {
    type: EDIT_USER_ERROR,
    error
  }
}

function fetchUserPending() {
  return {
    type: FETCH_USER_PENDING
  }
}

function fetchUserSuccess(payload) {
  console.log(payload);
  return {
    type: FETCH_USER_SUCCESS,
    payload
  }
}

function fetchUserError(error) {
  return {
    type: FETCH_USER_ERROR,
    error
  }
}

// TODO: after the refactoring user will not be needed, only accounts.
// "id","name","email","phone","otp_key","otp_verified","employee","created_at","updated_at","revised_schedule_agreed_at","terms_agreed_at","investor_type","revised_schedule_status"
const user = { id: 1, name: 'John S', email: 'user@email.com', phone: '0111111111', revisedScheduleAgreedAt: '2019/06/01', termsAgreedAt: '2019/06/01' };

export function editUser({ phone, revisedScheduleAgreedAt, termsAgreedAt }) {
  return dispatch => {
    dispatch(editUserPending());
    dispatch(editUserSuccess({ ...user, phone, revisedScheduleAgreedAt, termsAgreedAt }));

    //return agent
    //  .post(`${apiUrl}/api/user`)
    //  .send({ phone, revisedScheduleAgreedAt, termsAgreedAt })
    //  .then(response => dispatch(editUserSuccess(response.body)))
    //  .catch(error => {
    //    dispatch(editUserError(error))
    //    throw error
    //  })
  }
}

export function fetchUser() {
  return dispatch => {
    dispatch(fetchUserPending());

    dispatch(fetchUserSuccess(user));

    //agent
    //  .get(`${apiUrl}/api/user`)
    //  .then(response => dispatch(fetchUserSuccess(response.body)))
    //  .catch(error => {
    //    dispatch(fetchUserError(error))
    //    if (error.status !== 401) {
    //      throw error
    //    }
    //  })
  }
}
