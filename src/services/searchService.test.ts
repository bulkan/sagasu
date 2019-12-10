import { makeSearchService } from './search';

describe('searchService', () => {
  let searchService;
  let dataService;

  beforeEach(() => {
    dataService = {
      getKeysFromContentType: jest.fn().mockResolvedValue([]),
      queryByField: jest.fn().mockResolvedValue(null),
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
        tickets: [],
      });
    });

    it('should call dataService.getKeysFromContentType', async () => {
      expect(dataService.getKeysFromContentType.mock.calls).toEqual([
        [ {contentType: 'users'} ], [{contentType: 'tickets'}], [{contentType: 'organizations'}],
      ]);
    });
  });

  describe('#query', () => {
    it('should throw an error if required params arent passed', () => {
      const contentType = null;
      const field = null;
      const query = null;

      return expect(searchService.query({ contentType, field, query })).rejects.toThrow('Missing params');
    });

    it('should throw an error if contentType is not valid', () => {
      const contentType = 'wat';
      const field = 'name';
      const query = null;

      return expect(searchService.query({ contentType, field, query })).rejects.toThrow('wat is not a valid type');
    });

    it('should call dataService.queryByField', async () => {
      const contentType = 'organizations';
      const field = 'name';
      const query = 'Co';
      await searchService.query({ contentType, field, query });

      expect(dataService.queryByField).toHaveBeenCalledWith({
        contentType: 'organizations',
        field: 'name',
        query: 'Co',
      });
    });
  });
});
