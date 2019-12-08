const fs = require('fs');
const { Readable } = require('stream');
const { makeDataService } = require('./data');

jest.mock('fs');

describe('dataService', () => {
	let dataService;

	beforeEach(() => {
		dataService = makeDataService();
		const mockReadableStream = new Readable();
		mockReadableStream.push('[{"firstName":"bulkan","lastName":"evcimem", "id": "123"}]');
		mockReadableStream.push(null);
		fs.createReadStream.mockReturnValue(mockReadableStream);
	});

	describe('#getKeysFromContentType', () => {
		it('should throw an error if contentType is not provide', () => {
			return expect(dataService.getKeysFromContentType()).rejects.toThrow('Missing contentType')
		});

		it('should return list of available fields', async () => {
			const keys = await dataService.getKeysFromContentType('users');
			expect(keys).toEqual(['firstName', 'lastName', 'id']);
		});
	});
});

