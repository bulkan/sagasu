import program from 'commander';
import * as search from './services/searchService';
import { makeDataService } from './services/data';

const handleListCommandResult = results => {
	let output = 'Available Fields\n\n';

	Object.entries(results).map(([ key, value ]: [string, Array<string>]) => {
		output += `${key}\n`;
		output += `\n`.padStart(key.length, '-');
		output += `\n${value.join('\n')}\n\n`;
	});

	return output;
};

const handleSearchCommandResult = () => {
	return '';
};

export const handleCli = (argv) => {
	let actionPromise;

	const dataService = makeDataService();
	const searchService = search.makeSearchService({
		dataService
	});

	const programHelp = () => {
		program.help();
  	process.exit(1);
	};

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
		.requiredOption('-t, --type [value]', 'valid types; user | ticket | organisation')
		.requiredOption('-f, --field [value]', 'field to search by')
		.requiredOption('-q, --query [value]', 'search value')
		.action(({ type, field, query}) => {

			if (!['user', 'ticket', 'organisation'].includes(type)) {
				programHelp();
			};

			// @ts-ignore
			actionPromise = searchService.query({ type, field, query })
				.then(handleSearchCommandResult);
		});

	program.on('command:*', () => {
		console.error(`Invalid command - ${program.args.join()}`);
		programHelp();
	});

	program.parse(argv);

	if (!argv.slice(2).length) {
		programHelp();
	}

	return actionPromise;
};