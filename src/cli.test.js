const { handleCli } = require('./cli');
const searchService = require('./searchService');

jest.mock('./searchService', () => ({
	getFields: jest.fn()
}));

describe('cli', () => {
	describe('list', () => {
		beforeEach(() => {
			handleCli([ '', '', 'list' ]);
		});

		it('calls searchService', () => {
			expect(searchService.getFields).toHaveBeenCalled();
		});
	});

	describe('search', () => {
		describe('when all required options are provided', () => {
			it.todo('should call searchService');
		});


		describe('when any required options is not provided', () => {
			it.todo('should not call searchService');
		});
	})
})