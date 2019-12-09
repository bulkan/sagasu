const { handleCli } = require('./cli');

const search = require('./searchService');

const listFields = jest.fn().mockResolvedValue({
	fields: ['firstName']
});

const query = jest.fn().mockResolvedValue();

search.makeSearchService = () => ({
	listFields, query
});

describe('cli', () => {
	let searchService = search.makeSearchService();
	let output;

	describe('list', () => {
		beforeEach(async () => {
			output = await handleCli([ '', '', 'list' ]);
		});

		it('should return formatted output', () => {
			expect(output.replace(/\n/g, ' ')).toEqual(`Available Fields  fields -----  firstName  `);
		});

		it('calls searchService.listFields', () => {
			expect(searchService.listFields).toHaveBeenCalled();
		});
	});

	describe('search', () => {
		describe('when all required options are provided', () => {
			it('should call searchService.query', () => {
				handleCli(['', '', 'search', '-t', 'user', '-f', '_id', '-q', 'abc123']);
				expect(searchService.query).toHaveBeenCalledWith({
					type: 'user',
					field: '_id',
					query: 'abc123'
				});
			});
		});
	});
});