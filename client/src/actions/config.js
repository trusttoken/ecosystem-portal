import { EthService } from '@/contracts/EthService';

const moment = require('moment')

const { lockupBonusRate, earlyLockupBonusRate, earlyLockupsEnabledUntil } = require('./configuration');

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

  return async dispatch => {
    console.log("::: fetchConfig BEGIN");

    dispatch(fetchConfigPending());

    const start = await EthService.getTrustTokenLockStart();
    const unlockDate = moment(start).add(120, 'days');
    const isLocked = moment() < moment(unlockDate);

    console.log("::: fetchConfig start: " + start);
    console.log("::: fetchConfig unlockDate: " + unlockDate);
    console.log("::: fetchConfig isLocked: " + isLocked);

    const cfg = {
      lockupBonusRate,
      earlyLockupBonusRate,
      lockupsEnabled: true, // getLockupsEnabled(),
      earlyLockupsEnabledUntil,
      earlyLockupsEnabled: true, // getEarlyLockupsEnabled(),
      unlockDate: unlockDate,
      isLocked: isLocked,
      otcRequestEnabled: true, // ??? getOtcRequestEnabled()
    };

    console.log("::: fetchConfig: cfg: " + JSON.stringify(cfg));

    dispatch(fetchConfigSuccess(cfg));
    // TODO: in case of errors:
    // dispatch(fetchConfigError(error))
    console.log("::: fetchConfig END");
  }
}
