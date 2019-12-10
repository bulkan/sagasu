import program from 'commander';
import * as search from './services/search';
import { makeDataService } from './services/data';

const handleListCommandResult = (results: search.AvailableFields) => {
  const output =  [
    'Available Fields',
    ...Object.entries(results).map(([ contentType, fields ]) => {
      return [
        `${contentType.toUpperCase()}`,
        ``.padStart(contentType.length, '-'),
        ...fields,
        '',
      ];
    }),
  ];

  return output;
};

const handleSearchCommandResult = ({ contentType, results }) => {
  if (results && results.length === 0 ) {
    return ['No results found'];
  }

  const output = [
    `${contentType.toUpperCase()}`,
    ``.padStart(contentType.length, '-'),
    ...results.map((row) => {
      return [''].concat(Object.entries(row).map(([key, value]) => {
        return `${key}`.padEnd(50) + `${value}`;
      }));
    })
    .flat(),
  ];

  return output;
};

export const handleCli = (argv) => {
  let actionPromise;

  const dataService = makeDataService();
  const searchService = search.makeSearchService({ dataService });

  program.exitOverride();

  program
    .command('list')
    .description('List searchable fields')
    .action(() => {
      actionPromise = searchService.listFields()
        .then(handleListCommandResult);
    });

  program
    .command('search')
    .description('Search for a value with a data type')
    .requiredOption('-t, --contentType <type>', 'valid types; user | ticket | organisation')
    .requiredOption('-f, --field <field>', 'field to search by')
    .option('-q, --query [query]', 'search value')
    .action(({ contentType, field, query = ''}) => {
      if (!['users', 'tickets', 'organizations'].includes(contentType)) {
        console.error(`${contentType} is not a valid type\n`);
        program.help();
      }

      actionPromise = searchService.query({ contentType, field, query })
        .then((results) => handleSearchCommandResult({contentType, results}));
    });

  program.on('command:*', () => {
    console.error(`Invalid command - ${program.args.join()}`);
    program.help();
  });

  try {
    program.parse(argv);
  } catch (err) {
    actionPromise = Promise.reject('Invalid command');
  }

  if (!argv.slice(2).length) {
    console.error(`Invalid command - ${program.args.join()}`);
    program.help();
  }

  return actionPromise;
};
