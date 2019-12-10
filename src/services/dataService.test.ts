import * as fs from 'fs';
import { Readable } from 'stream';
import { makeDataService } from './data';

jest.mock('fs');

const users = [
  {
    firstName: 'Emma',
    lastName: 'Andersen',
    email: 'emma.andersen@example.com',
    favColors: [ 'red', 'teal' ]
  }, {
    firstName: 'Rose',
    lastName: 'Baker',
    email: '',
    favColors: [ 123 ]
  }, {
    firstName: 'Daryl',
    lastName: 'Gonzales',
    email: 'daryl.gonzales@example.com',
    favColors: [ 'pink' ]
  }, {
    firstName: 'bulkan',
    lastName: 'evcimen',
    email: 'bulkan@gmail.com',
    favColors: [ 'blue' ]
  }, {
    id: 666,
    lastName: 'gilfyole',
    email: 'gilfyole@piedpiper.com',
    favColors: [ 'red' ]
  }, {
    firstName: 'Valentine',
    lastName: 'Moulin',
    email: 'valentine.moulin@example.com'
  }, {
    firstName: 'German',
    lastName: 'Prieto',
    email: 'german.prieto@example.com'
  }
];

describe('dataService', () => {
  const dataService = makeDataService();

  beforeEach(() => {
    const mockReadableStream = new Readable();
    mockReadableStream.push(JSON.stringify(users));
    mockReadableStream.push(null);

    // @ts-ignore
    fs.createReadStream.mockReturnValue(mockReadableStream);
  });

  describe('#getKeysFromContentType', () => {
    it('should throw an error if contentType is not provide', () => {
      return expect(dataService.getKeysFromContentType({})).rejects.toThrow('Missing contentType');
    });

    it('should return list of available fields', async () => {
      const keys = await dataService.getKeysFromContentType({ contentType: 'users' });
      expect(keys).toEqual(['firstName', 'lastName', 'email', 'favColors', 'id' ]);
    });
  });

  describe('#queryByField', () => {
    it('should return fields found', async () => {
      const results = await dataService.queryByField({
        contentType: 'users',
        field: 'lastName',
        query: 'evcimen',
      });
      expect(results).toEqual(
        [{ firstName: 'bulkan', lastName: 'evcimen', email: 'bulkan@gmail.com', favColors: ['blue'] }],
      );
    });

    it('should handle missing properties on records', async () => {
      const results = await dataService.queryByField({
        contentType: 'users', field: 'firstName', query: 'bertram',
      });

      expect(results).toEqual([]);
    });

    it('should treat fields as string', async () => {
      const results = await dataService.queryByField({
        contentType: 'users', field: 'id', query: '666',
      });

      expect(results).toEqual([
        { lastName: 'gilfyole', email: 'gilfyole@piedpiper.com', id: 666, favColors: ['red'] },
      ]);
    });

    it('should allow searching on empty fields', async () => {
      const results = await dataService.queryByField({
        contentType: 'users', field: 'email', query: '',
      });

      expect(results).toEqual([{
        email: '',
        favColors: [123],
        firstName: 'Rose',
        lastName: 'Baker'
      }]);
    });

    it('should allow searching within array fields', async () => {
      const results = await dataService.queryByField({
        contentType: 'users', field: 'favColors', query: 'blue',
      });

      expect(results).toEqual([{
        favColors: [ 'blue' ],
        firstName: 'bulkan',
        lastName: 'evcimen',
        email: 'bulkan@gmail.com'
      }]);
    });

    it('should treat array field values as strings', async () => {
      const results = await dataService.queryByField({
        contentType: 'users', field: 'favColors', query: '123',
      });

      expect(results).toEqual([{
        email: '',
        favColors: [123],
        firstName: 'Rose',
        lastName: 'Baker'
      }]);
    });
  });
});
