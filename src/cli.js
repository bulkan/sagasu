const program = require('commander');
const searchService = require('./searchService');

const handleCli = () => {
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
		.requiredOption('-t, --type [value]', 'valid fields    user | ticket | organisation')
		.action(({ type }) => {
			if (!['user', 'ticket', 'organisation'].includes(type)) {
				programHelp();
			};

			console.log(type);

			// prompt here ?

			// searchService.search({ type });
		});

	program.parse(process.argv);

	if (!process.argv.slice(2).length) {
		programHelp();
	}
};

module.exports = {
	handleCli
};
