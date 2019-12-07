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
		.requiredOption('-q, --query [value]', 'search value')
		.action(({ type, field, query}) => {

			if (!['user', 'ticket', 'organisation'].includes(type)) {
				programHelp();
			};

			const results = searchService.query({ type, field, query });
			console.log(results);
		});

	program.parse(argv);

	if (!argv.slice(2).length) {
		programHelp();
	}
};

module.exports = {
	handleCli
};
