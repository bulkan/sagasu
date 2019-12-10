#!/usr/bin/env -S ts-script

import fs from 'fs';
import faker from 'faker';
import JSONStream from 'JSONStream';

const generateUser = () => {
  const id = faker.random.number();
  const name = faker.name.findName();

  return {
    _id: id,
    url: `http://initech.zendesk.com/api/v2/users/${id}.json`,
    external_id: faker.random.uuid(),
    name,
    alias: name,
    created_at: faker.date.past(),
    active: faker.random.boolean(),
    verified: faker.random.boolean(),
    shared: faker.random.boolean(),
    locale: faker.random.locale(),
    timezone: faker.address.city(),
    last_login_at: faker.date.recent(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    signature: `Don't Worry Be Happy!`,
    organization_id: faker.random.number(),
    tags: [
      'Springville',
      'Sutton',
      'Hartsville/Hartley',
      'Diaperville'
    ],
    suspended: faker.random.boolean(),
    role: 'admin'
  };
};

const main = () => {
  const transformStream = JSONStream.stringify();
  const outputStream = fs.createWriteStream(`${__dirname}/large-users.json`);

  transformStream.pipe(outputStream);

  const max = 100000;

  for (let i = 0; i <= max; i++) {
    console.log(`Generating user ${i++} / ${max}`);
    const user = generateUser();
    transformStream.write(user);
  }

  transformStream.end();

  outputStream.on('finish', () => console.log('done'));
};

if (require.main === module) {
  main();
}
