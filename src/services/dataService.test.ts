import * as fs from 'fs';
import { Readable } from 'stream';
import { makeDataService } from './data';

jest.mock('fs');

describe('dataService', () => {
	const dataService = makeDataService();
	const jsonString = `[{"firstName":"bulkan","lastName":"evcimen","id":"123"},{"lastName":"gilfyole","id":444}]`;

	beforeEach(() => {
		const mockReadableStream = new Readable();
		mockReadableStream.push(jsonString);
		mockReadableStream.push(null);

		//@ts-ignore
		fs.createReadStream.mockReturnValue(mockReadableStream);
	});

	describe('#getKeysFromContentType', () => {
		it('should throw an error if contentType is not provide', () => {
			return expect(dataService.getKeysFromContentType({})).rejects.toThrow('Missing contentType')
		});

		it('should return list of available fields', async () => {
			const keys = await dataService.getKeysFromContentType({contentType: 'users' });
			expect(keys).toEqual(['firstName', 'lastName', 'id']);
		});
	});

	describe('#filterByFieldAndValue', () => {
		it.todo('should throw an error if required params arent passed');

		it('should return fields found', async () => {
			const results = await dataService.queryByField({ 
				contentType: 'users', 
				field: 'lastName', 
				query: 'evcimen' 
			});
			expect(results).toEqual(
				[ { firstName: 'bulkan', lastName: 'evcimen', id: '123' } ]
			)
		});

		it('should handle missing properties on records', async () => {
			const results = await dataService.queryByField({
				contentType: 'users',  field: 'firstName', query: 'bertram'
			});
			expect(results).toEqual([]);
		});

		it('should treat fields as string', async () => {
			const results = await dataService.queryByField({
				contentType: 'users', field: 'id', query: '444' 
			});
			expect(results).toEqual([
				{lastName: 'gilfyole', id: 444}
			]);
		});
	});
});

