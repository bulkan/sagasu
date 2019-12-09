import { handleCli } from './cli';
import * as search from './services/search';

describe('cli', () => {
	let output;
	
	let query;
	let listFields;

	beforeEach(() => {
		query = jest.fn().mockResolvedValue([]);

		listFields = jest.fn().mockResolvedValue({
			fields: ['firstName']
		});

		jest.spyOn(search, 'makeSearchService').mockReturnValue({
			listFields, query
		} as search.SearchService);

	});

	describe('command: list', () => {
		beforeEach(async () => {
			output = await handleCli([ '', '', 'list' ]);
		});

		it('should return formatted output', () => {
			const expected = [
				`Available Fields`,
				'fields', '------', 'firstName', ''
			];
			expect(output.flat()).toEqual(expected);
		});

		it('calls searchService.listFields', () => {
			expect(listFields).toHaveBeenCalled();
		});
	});

	
	describe('command: search', () => {			
		let output;
		
		describe('when all required options is NOT provided', () => {
			beforeEach(async () => {
				jest.spyOn(process, 'exit').mockImplementation();

				output = await handleCli(['', '', 'search', '-f', '_id', '-q', '123']);
			});
			it('should show program help', () => {

			});
		});

		describe('when all required options are provided', () => {
			describe('and there are results', () => {
				beforeEach(async () => {
					query.mockResolvedValue([
						{_id: '123', name: 'bulks'}
					]);			
		
					output = await handleCli(['', '', 'search', '-t', 'users', '-f', '_id', '-q', '123']);
				});

				it('should formatted results', () => {
					const expected = [
						'USERS', '-----', '',
						'_id'.padEnd(50) + '123',
						'name'.padEnd(50) + 'bulks'
					];

					expect(output).toEqual(expected);
				});
			});

			describe('and there are no results', () => {
				beforeEach(async () => {
					output = await handleCli(['', '', 'search', '-t', 'users', '-f', '_id', '-q', 'abc123']);
				});
				it('should formatted results', () => {
					expect(output).toEqual(['No results found']);
				});
				
				it('should call searchService.query', () => {
					expect(query).toHaveBeenCalledWith({
						contentType: 'users',
						field: '_id',
						query: 'abc123'
					});
				});
			});
		});
	});
});