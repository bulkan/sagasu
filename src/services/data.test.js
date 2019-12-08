const { makeDataService } = require('./data');

describe('dataService', () => {
	let dataService;

	beforeEach(() => {
		dataService = makeDataService();
	});

	describe('#getKeysFromContentType', () => {
		it('should throw an error if contentType is not provide', () => {
			return expect(dataService.getKeysFromContentType()).rejects.toThrow('Missing contentType')
		});

		it('should return list of available fields', async () => {
			const keys = await dataService.getKeysFromContentType('users');
			console.log(keys);

		});
	});
});