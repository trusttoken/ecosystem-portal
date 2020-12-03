import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'

import { DataContext } from '@/providers/data';

import { vestingSchedule } from '@/lib/vesting';
import { formatNumber } from '@/utils/formatNumber';

import {
  calculateGranted,
  calculateVested,
  momentizeGrant
} from '@/lib/shared'



const DateAndDayLabel = styled.div`
  margin-top: 4px;
  margin-left: -50%;
  line-height: 8px;
  font-size: 12px;

  ${({ i }) => i === 0 && `margin-left: 0;`};
  ${({ i }) => i === 8 && `margin-left: -100%;`};
`;

const Amount = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 28px;
  line-height: 40px;
  color: #061439;
`;

const Ticker = styled.div`
  display: inline;
  font-size: 16px;
  color: #7A859E;
  padding-left: 4px;
`;

const VestingBars = ({grants}) => {
  const [displayPopover, setDisplayPopover] = useState({})

  if (!grants || grants.length === 0) {
    return null;
  }

  const granted = calculateGranted(grants);
  const vested = calculateVested(grants);
  const unvested = granted.minus(vested);

  const now = moment()

  // Momentize all the dates
  const mgrants = grants.map(grant => {
    return {
      ...grant,
      start: moment(grant.start),
      end: moment(grant.end),
      cancelled: grant.cancelled ? moment(grant.cancelled) : grant.cancelled
    }
  })

  const firstStartDate = moment(Math.min(...mgrants.map(g => g.start)))
  const lastEndDate = moment(Math.max(...mgrants.map(g => g.end)))
  const totalDuration = lastEndDate - firstStartDate

  const maxMarkers = 8;

  const generateMarkers = () => {

    const monthMarkers = generateMonthMarkers(maxMarkers);
    const amountMarkers = generateAmountMarkers(maxMarkers);

    const markers = [];
    for (let i = 0; i < maxMarkers; i++) {
      markers.push({
        amountLabel: amountMarkers[i].label,
        dayLabel: monthMarkers[i].dayLabel,
        dateLabel: monthMarkers[i].dateLabel,
        left: amountMarkers[i].left,
      });
    }
    markers.push({
      amountLabel: mgrants[0].amount,
      dateLabel: firstStartDate.clone().add(750, 'days').format('MM/DD/YYYY'),
      left: 100,
    });
    return markers;
  }

  const generateMonthMarkers = maxMarkers => {
    // Extract x points (months) across the duration to display between first
    // start date and last end date to display
    const startDateAndDay = { date: firstStartDate.clone(), day: 0};
    const intervals = [120, 90, 90, 90, 90, 90, 90, 90];
    const datesAndDays = [startDateAndDay];

    let interimDate = startDateAndDay.date;
    let interimDay = startDateAndDay.day;
    intervals.forEach((interval) => {
      interimDate = interimDate.clone().add(interval, 'days');
      interimDay = interimDay += interval;
      datesAndDays.push({ date: interimDate, day: interimDay });
    });

    return datesAndDays.map((dateAndDay) => {
      return {
        dateLabel: dateAndDay.date.format('MM/DD/YYYY'),
        dayLabel: dateAndDay.day,
      };
    });

    return months.map(month => {
      return {
        label: moment(month).format('MMM YYYY'),
        left: ((moment(month) - firstStartDate) / totalDuration) * 100
      }
    })
  }

  const generateAmountMarkers = maxMarkers => {
    return [...Array(maxMarkers + 1).keys()].map(i => {
      return {
        label: formatNumber((mgrants[0].amount / maxMarkers) * i),
        left: (100 / maxMarkers) * i
      }
    })
  }

  const handleTogglePopover = (event, grantId) => {
    // Calculate a left offset to make the popover display at the point of the
    // mouse click
    const leftOffset =
      document.getElementById('main').offsetLeft +
      document.getElementById('vestingBars').offsetLeft +
      50
    setDisplayPopover({
      ...displayPopover,
      [grantId]: displayPopover[grantId] ? false : event.clientX - leftOffset
    })
  }

  const total = BigNumber(vested).plus(BigNumber(unvested))

  return (
    <div className="mb-5">
      <h2 style={{ marginBottom: '2.5rem' }}>Unlocking Progress</h2>
      <div id="vestingBars" style={{ position: 'relative' }}>
        {mgrants.map(grant => {
          // Calculate the percentage of the grant that is complete with a
          // upper bound of 100

          let i = 0;
          vestingSchedule(grant).forEach((vest, index) => {
              if (vest.vested) {
                  i = index;
              }
          });

          const complete = false ? 0 : Math.min((100.0 / maxMarkers) * i, 100)
          // Calculate the width of the grant relative to the width of the
          // total component
          const width = ((grant.end - grant.start) / totalDuration) * 100
          // Calculate the left indentation from the left side of the component
          const left = ((grant.start - firstStartDate) / totalDuration) * 100

          return (
            <div
              className="progress mt-3 pointer"
              key={grant.id}
              style={{ width: `${width}%`, marginLeft: `${left}%` }}
              onClick={event => handleTogglePopover(event, grant.id)}
            >
              <div
                className="progress-bar bg-green"
                role="progressbar"
                style={{ width: `${complete}%`, zIndex: 10 }}
              />
              {displayPopover[grant.id] && (
                <div
                  className="popover"
                  style={{ left: `${displayPopover[grant.id]}px`, top: '10px' }}
                >
                  <div
                    className="cover"
                    onClick={event => handleTogglePopover(event, grant.id)}
                  />
                  <div>
                    <strong>Start</strong> Day 0
                  </div>
                  {grant.cliff && (
                    <div>
                      <strong>Cliff</strong> Day 120
                    </div>
                  )}
                  <div>
                    <strong>End</strong> Day 750
                  </div>
                  <div>
                    <strong>Grant</strong>{' '}
                    {formatNumber(grant.amount)}{' '}
                    <span className="ogn">TRU</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {generateMarkers().map((marker, index) => {
          const style = {
            position: 'absolute',
            left: `${marker.left}%`,
            top: 0,
            height: `${1 + 2 * mgrants.length}rem`,
            marginTop: '-1rem',
            pointerEvents: 'none' // Stop absolute positioning from stealing clicks
          }
          return (
            <div key={index} style={style}>
              <div
                style={{
                  borderLeft: '1px solid #dbe6eb',
                  height: '100%',
                  width: 0
                }}
              ></div>
              <DateAndDayLabel i={index}>
                <small className="text-muted">
                  {formatNumber(marker.amountLabel)}<br/>
                  {marker.dateLabel}
                </small>
              </DateAndDayLabel>
            </div>
          )
        })}
      </div>
      <div
        className="row"
        style={{ marginTop: `${5 * mgrants.length}rem` }}
      >
        <div className="col-12 col-sm-4">
          <div className="status-circle bg-green mr-2"></div>
          <span className=" text-muted">
            Purchased TrustTokens
            <Amount>{formatNumber(mgrants[0].amount)} <Ticker>TRU</Ticker></Amount>
          </span>
        </div>
        <div className="col-12 col-sm-4">
          <div className="status-circle bg-green mr-2"></div>
          <span className="text-muted">
            Unlocked
            <Amount>{formatNumber(vested)} <Ticker>TRU</Ticker></Amount>
          </span>
        </div>
        <div className="col-12 col-sm-4">
          <div className="status-circle mr-2"></div>
          <span className=" text-muted">
            Locked
            <Amount>{formatNumber(unvested)} <Ticker>TRU</Ticker></Amount>
          </span>
        </div>
      </div>
    </div>
  )
}

export default VestingBars
