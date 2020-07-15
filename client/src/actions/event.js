export const FETCH_EVENTS_PENDING = 'FETCH_EVENTS_PENDING'
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS'
export const FETCH_EVENTS_ERROR = 'FETCH_EVENTS_ERROR'

function fetchEventsPending() {
  return {
    type: FETCH_EVENTS_PENDING
  }
}

function fetchEventsSuccess(payload) {
  return {
    type: FETCH_EVENTS_SUCCESS,
    payload
  }
}

function fetchEventsError(error) {
  return {
    type: FETCH_EVENTS_ERROR,
    error
  }
}

const sample_data = {
    "device": {
        "os": "Linux 64",
        "source": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
        "browser": "Chrome",
        "version": "83.0.4103.61",
        "isMobile": false,
        "platform": "Linux",
        "isDesktop": true
    },
    "location": null
};

const sample_event = {id: 1, user_id: 5026, action: 'LOGIN', data: sample_data, created_at: '2020-06-22 17:08:29.702+00', updated_at: '2020-06-22 17:08:29.702+00'};

export function fetchEvents() {
  return dispatch => {
    dispatch(fetchEventsPending());

    dispatch(fetchEventsSuccess([sample_event]));
    // TODO: If that would fail for some reason then:
    // dispatch(fetchEventsError(error))
  }
}
