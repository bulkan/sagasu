const program = require('commander');
const search = require('./searchService');

const handleCli = async (argv) => {
	let actionPromise;

	const searchService = search.makeSearchService();

	const programHelp = () => {
		program.help();
  	process.exit(1);
	};

	program
		.command('list')
		.description('List searchable fields')
		.action(() => {
			actionPromise = searchService.getFields();
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

			actionPromise = searchService.query({ type, field, query });
		});

	program.parse(argv);

	if (!argv.slice(2).length) {
		programHelp();
	}

	return actionPromise;
};

module.exports = {
	handleCli
};
