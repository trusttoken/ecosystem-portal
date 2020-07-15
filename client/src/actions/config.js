
const moment = require('moment')

const { unlockDate, lockupBonusRate, earlyLockupBonusRate, earlyLockupsEnabledUntil } = require('./configuration');

export const FETCH_CONFIG_PENDING = 'FETCH_CONFIG_PENDING'
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS'
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR'

function fetchConfigPending() {
  return {
    type: FETCH_CONFIG_PENDING
  }
}

function fetchConfigSuccess(payload) {
  return {
    type: FETCH_CONFIG_SUCCESS,
    payload
  }
}

function fetchConfigError(error) {
  return {
    type: FETCH_CONFIG_ERROR,
    error
  }
}

export function fetchConfig() {
  console.log("::: fetchConfig");

  return dispatch => {
    console.log("::: fetchConfig BEGIN");

    dispatch(fetchConfigPending())

    const cfg = {
      lockupBonusRate,
      earlyLockupBonusRate,
      lockupsEnabled: true, // getLockupsEnabled(),
      earlyLockupsEnabledUntil,
      earlyLockupsEnabled: true, // getEarlyLockupsEnabled(),
      unlockDate: unlockDate,  // TODO: retrieve from contract?
      isLocked: moment() < moment(unlockDate),
      otcRequestEnabled: true, // ??? getOtcRequestEnabled()
    };

    console.log("::: fetchConfig: cfg: " + JSON.stringify(cfg));

    dispatch(fetchConfigSuccess(cfg));
    // TODO: in case of errors:
    // dispatch(fetchConfigError(error))
    console.log("::: fetchConfig END");
  }
}
