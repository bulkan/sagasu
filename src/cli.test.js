const { handleCli } = require('./cli');
const searchService = require('./searchService');

jest.mock('./searchService', () => ({
	getFields: jest.fn(),
	query: jest.fn()
}));

describe('cli', () => {
	describe('list', () => {
		beforeEach(() => {
			handleCli([ '', '', 'list' ]);
		});

		it('calls searchService.getFields', () => {
			expect(searchService.getFields).toHaveBeenCalled();
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