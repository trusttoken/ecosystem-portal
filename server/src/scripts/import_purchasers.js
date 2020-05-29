const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const db = require('../models');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function currencyStringToInteger(currencyString) {
  return Math.floor(Number(currencyString.replace(/[^0-9.-]+/g,"")));
}

function getCsvRecords() {
  const content = fs.readFileSync(`${__dirname}/../../../ttecopurchasers.csv`, 'utf8');
  const records = parse(content, { columns: true });
  console.log(records[0]);
  return records;
}

async function createUsers(csvRecords) {
  for (csvRecord of csvRecords) {
    const email = csvRecord.Email.includes(';') ? csvRecord.Email.split(';')[0] : csvRecord.Email;

    let user;
    user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      const userJson = {
        name: csvRecord.Name,
        email: email,
      };

      if (csvRecords['Amendment Signed'] === '1') {
        userJson.revised_schedule_status = 'Accepted';
      }

      console.log(userJson);

      user = await db.User.create(userJson);
      await createGrant(user, csvRecord);
    } else {
      console.log('ADDING ADDITIONAL AMOUNT TO ' + user.email);
      const grant = await db.Grant.findOne({ where: { userId: user.id }});
      grant.amount = grant.amount + currencyStringToInteger(csvRecord['Confirmed Dollars']);
      await grant.save();
    }

    await sleep(500);
  }
}

async function createGrant(user, csvRecord) {
  const grant =  await db.Grant.create({
    userId: user.id,
    // Note: Some investors were granted a decimal amount of OGN.
    // We round it up to an integer amount.
    amount: currencyStringToInteger(csvRecord['Confirmed Dollars']),
    start: '2020-04-27',
    end: '2022-05-17',
    cliff: Date.now(),
  });
}

async function updateGrantAmount(user, csvRecord) {
  const grant = await db.Grant.findOne({ where: { userId: user.id }});
  grant.amount = grant.amount + Math.floor(Number(csvRecord['Confirmed Dollars'].replace(/[^0-9.-]+/g,"")));
  await grant.save();
}

async function importPurchasers() {
  const records = getCsvRecords();
  await createUsers(records);
}

importPurchasers();
