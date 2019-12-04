const program = require('commander');
const searchService = require('./searchService');

const handleCli = (argv) => {
	const programHelp = () => {
		program.help();
  	process.exit(1);
	};

	program
		.command('list')
		.description('List searchable fields')
		.action(() => {
			console.log(searchService.getFields());
		});

	program
		.command('search')
		.description('Search for a value with a data type')
		.requiredOption('-t, --type [value]', 'valid types; user | ticket | organisation')
		.requiredOption('-f, --field [value]', 'field to search by')
		.requiredOption('-q, --value [value]', 'search value')
		.action(({ type, field, value}) => {

			if (!['user', 'ticket', 'organisation'].includes(type)) {
				programHelp();
			};

			console.log({ type, field, value});
			// searchService.search({ type });
		});

	program.parse(argv);

	if (!argv.slice(2).length) {
		programHelp();
	}
};

module.exports = {
	handleCli
};
