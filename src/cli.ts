import program from 'commander';
import * as search from './services/search';
import { makeDataService } from './services/data';

const handleListCommandResult = (results: search.AvailableFields) => {
	let output = 'Available Fields\n\n';

	Object.entries(results).forEach(([ key, value ]) => {
		output += `${key}\n`;
		output += `\n`.padStart(key.length, '-');
		output += `\n${value.join('\n')}\n\n`;
	});

	return output;
};

const handleSearchCommandResult = ({ contentType, results }) => {
	if (results && results.length === 0 ) {
		return 'No results found';
	};
	
	let output = [
		`${contentType.toUpperCase()}`,
		``.padStart(contentType.length, '-'),
		...results.map(row => {
			return [''].concat(Object.entries(row).map(([key, value]) => {
				return `${key}`.padEnd(50) + `${value}`;
			}));
		})
		.flat(),
	];
	
	return output.join('\n');
};

export const handleCli = (argv) => {
	let actionPromise;

	const dataService = makeDataService();
	const searchService = search.makeSearchService({ dataService });

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
		.requiredOption('-q, --query <query>', 'search value')
		.action(({ contentType, field, query}) => {
			if (!['users', 'tickets', 'organisations'].includes(contentType)) {
				console.error(`${contentType} is not a valid type\n`);
				program.help();
			};

			actionPromise = searchService.query({ contentType, field, query })
				.then(results => handleSearchCommandResult({contentType, results}));
		});

	program.on('command:*', () => {
		console.error(`Invalid command - ${program.args.join()}`);
		program.help();
	});

	program.parse(argv);

	return actionPromise;
};