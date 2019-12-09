import { handleCli } from './cli';
import * as search from './services/searchService';

describe('cli', () => {
	let output;
	
	let query;
	let listFields;

	beforeEach(() => {
		query = jest.fn().mockResolvedValue(null);

		listFields = jest.fn().mockResolvedValue({
			fields: ['firstName']
		});

		jest.spyOn(search, 'makeSearchService').mockReturnValue({
			listFields, query
		});

	});

	describe('list', () => {
		beforeEach(async () => {
			output = await handleCli([ '', '', 'list' ]);
		});

		it('should return formatted output', () => {
			expect(output.replace(/\n/g, ' ')).toEqual(`Available Fields  fields -----  firstName  `);
		});

		it('calls searchService.listFields', () => {
			expect(listFields).toHaveBeenCalled();
		});
	});

	describe('search', () => {
		describe('when all required options are provided', () => {
			it('should call searchService.query', () => {
				handleCli(['', '', 'search', '-t', 'user', '-f', '_id', '-q', 'abc123']);
				expect(query).toHaveBeenCalledWith({
					type: 'user',
					field: '_id',
					query: 'abc123'
				});
			});
		});
	});
});