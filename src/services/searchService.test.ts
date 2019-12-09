import { makeSearchService } from './search';

describe('searchService', () => {
	let searchService;
	let dataService;

	beforeEach(() => {
		dataService = {
			getKeysFromContentType: jest.fn().mockResolvedValue([])
		};

		searchService = makeSearchService({ dataService });
	});

	describe('#list', () => {
		let results;

		beforeEach(async () => {
			results = await searchService.listFields();
		});

		it('should return correctly formatted results', () => {
			expect(results).toEqual({
				users: [],
				organizations: [],
				tickets: []
			});
		});

		it('should call dataService.getKeysFromContentType', async () => {
			expect(dataService.getKeysFromContentType.mock.calls).toEqual([
				[ {contentType: 'users'} ], [{contentType: 'tickets'}], [{contentType: 'organizations'}]
			]);
		});
	});

	describe('#query', () => {
		it.todo('should return all results');
	});
});