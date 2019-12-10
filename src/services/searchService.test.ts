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
    beforeEach(async () => {
      const contentType = 'organizations';
      const field = 'name';
      const query = 'Co';
      await searchService.query({ contentType, field, query });
    });

    it('should call dataService.queryByField', () => {
      expect(dataService.queryByField).toHaveBeenCalledWith({
        contentType: 'organizations',
        field: 'name',
        query: 'Co',
      });
    });
  });
});
