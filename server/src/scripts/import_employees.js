const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const db = require('../models');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getCsvRecords() {
  const content = fs.readFileSync(`${__dirname}/active-employee-info.csv`, 'utf8');
  const records = parse(content, { columns: true });
  return records;
}

async function createUsers(csvRecords) {
  for (csvRecord of csvRecords) {
    const email = csvRecord['Work Email'].includes(';') ? csvRecord['Work Email'].split(';')[0] : csvRecord['Work Email'];

    console.log(`Lookings for ${email}...`);

    let user;
    user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      const userJson = {
        name: csvRecord.Name,
        email: email,
      };

      console.log(`Creating user for ${email}...`);
      try {
        user = await db.User.create(userJson);
      } catch (err) {
        console.log(`Error creatings user for ${email}`);
        console.log(err);
      }
    } else {
      console.log(`${email} already has an account.`);
    }

    await sleep(500);
  }
}

async function importEmployees() {
  const records = getCsvRecords();
  await createUsers(records);
}

importEmployees();
