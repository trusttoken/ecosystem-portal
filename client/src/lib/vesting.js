
const moment = require('moment')
const BigNumber = require('bignumber.js')

/** Ensures the passed variable is a moment
 *
 * @param {moment|String} date
 */
function toMoment(date) {
  if (!date) return date
  if (!moment.isMoment(date)) return moment.utc(date)
  return date
}

/** Convert the dates of a grant object to moments.
 *
 * @param {Object} grant: grant object
 */
function momentizeGrant(grant) {
  return {
    ...grant,
    start: toMoment(grant.start),
    end: toMoment(grant.end),
    cliff: toMoment(grant.cliff),
    cancelled: toMoment(grant.cancelled)
  }
}

/** Returns an array of vesting objects that include a datetime and status
 * associated with each vesting event.
 *
 * @param {Object} grantObj: plain grant object
 */
function vestingSchedule(grantObj) {
    return investorVestingSchedule(grantObj)
}

/** Return a vesting schedule for an employee. Employee vests have a cliff and vest monthly
 * thereafter.
 *
 * @param {Object} grantObj: plain grant object
 */
function employeeVestingSchedule(grantObj) {
  const grant = momentizeGrant(grantObj)

  const vestingEventCount = grant.end.diff(grant.start, 'months')
  const cliffVestingCount = grant.cliff.diff(grant.start, 'months')
  const cliffVestAmount = BigNumber(grant.amount)
    .times(cliffVestingCount)
    .div(vestingEventCount)
    .integerValue(BigNumber.ROUND_FLOOR)

  // Calculate the amount vested per remaining event
  const vestedPerEvent = BigNumber(grant.amount)
    .minus(cliffVestAmount)
    .div(vestingEventCount - cliffVestingCount)

  // Calculate the value for the remaining vesting amount and fill an array
  // with length of the number of remaining vesting events with that value
  const remainingVestingCount = vestingEventCount - cliffVestingCount
  const remainingVestingAmounts = Array(remainingVestingCount).fill(
    vestedPerEvent.integerValue(BigNumber.ROUND_FLOOR)
  )

  // Complete vesting array
  const vestingEvents = [cliffVestAmount, ...remainingVestingAmounts]

  // Add an rounding errors to the last vesting event
  const roundingError = BigNumber(grant.amount).minus(
    vestingEvents.reduce((a, b) => a.plus(b), BigNumber(0))
  )
  vestingEvents[vestingEvents.length - 1] = vestingEvents[
    vestingEvents.length - 1
  ].plus(roundingError)

  const events = vestingEvents.map((currentVestingEvent, index) => {
    const vestingDate = grant.cliff.clone()
    if (index > 0) {
      vestingDate.add(index, 'months')
    }
    return {
      grantId: grantObj.id,
      amount: currentVestingEvent,
      date: vestingDate.clone(),
      vested: hasVested(vestingDate, grant)
    }
  })
  return events
}

/** Return a vesting schedule for an investors. Investors have a 6% initial vest  plus 11.75%
 * vesting quarterly thereafter.
 *
 * @param {Object} grantObj: plain grant object
 */
function investorVestingSchedule(grantObj) {
  console.log("investorVestingSchedule: grantObj: " + JSON.stringify(grantObj))

  const grant = momentizeGrant(grantObj)

  const vestingSchedule = []

  // Calculate initial vest percentage granted on grant start date
  const initialVestPercentage = 0
  const initialVestAmount = BigNumber(grant.amount)
    .times(initialVestPercentage)
    .div(100)
    .integerValue(BigNumber.ROUND_FLOOR)

  // Time after which regular quarterly vesting begins
  const quarterlyVestDelayMonths = 4
  const quarterlyVestingPercentage = (100 - initialVestPercentage) / 8
  const quarterlyVestAmount = BigNumber(grant.amount)
    .times(quarterlyVestingPercentage)
    .div(100)
    .integerValue(BigNumber.ROUND_FLOOR)

  // Rounding error caused by ROUND_FLOOR over total grant which should be added to the final vesting
  // event
  const roundingError = BigNumber(grant.amount).minus(
    quarterlyVestAmount.times(8).plus(initialVestAmount)
  )
  const adjustedFinalVest = quarterlyVestAmount.plus(roundingError)

  // Add initial vest
  // vestingSchedule.push({
  //   grantId: grantObj.id,
  //   amount: initialVestAmount,
  //   date: grant.start.clone(),
  //   vested: hasVested(grant.start, grantObj)
  // })

  // const vestingDate = grant.start.clone()
  // // Iterate over quarterly vests and push
  // for (let i = 0; i < 8; i++) {
  //   if (i === 0) {
  //     // Add initial delay to vesting fdate
  //     vestingDate.add(quarterlyVestDelayMonths, 'months')
  //   } else {
  //     // Add quarter of a year to the last vesting date
  //     vestingDate.add(3, 'months')
  //   }
  //   vestingSchedule.push({
  //     grantId: grantObj.id,
  //     amount: i === 7 ? adjustedFinalVest : quarterlyVestAmount,
  //     date: vestingDate.clone(),
  //     vested: hasVested(vestingDate, grant)
  //   })
  // }

  const vestingDelaysInDays = [120, 210, 300, 390, 480, 570, 660, 750];

  for (let i = 0; i < vestingDelaysInDays.length; i++) {
    const vestingDate = grant.start.clone();
    vestingDate.add(vestingDelaysInDays[i], 'days');
    vestingSchedule.push({
      grantId: grantObj.id,
      amount: grant.amount / 8,
      date: vestingDate.clone(),
      day: vestingDelaysInDays[i],
      vested: hasVested(vestingDate, grant),
    });
  }

  console.log("vestingSchedule: " + JSON.stringify(vestingSchedule))

  return vestingSchedule
}

function hasVested(vestingDate, grant) {
  const now = moment.utc()
  return (
    vestingDate <= now && (!grant.cancelled || grant.cancelled >= vestingDate)
  )
}

/** Returns the number of tokens vested by a grant.
 *
 * @param {User} user: DB user object
 * @param {Object} grantObj: plain grant object
 */
function vestedAmount(grantObj) {
  return vestingSchedule(grantObj)
    .filter(v => v.vested)
    .reduce((total, vestingEvent) => {
      return total.plus(BigNumber(vestingEvent.amount))
    }, BigNumber(0))
}

export {
  momentizeGrant,
  toMoment,
  vestingSchedule,
  vestedAmount
};
