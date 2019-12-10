import { handleCli } from './cli';
import * as search from './services/search';

describe('cli', () => {
  let query;
  let listFields;

  beforeEach(() => {
    query = jest.fn().mockResolvedValue([]);

    listFields = jest.fn().mockResolvedValue({
      fields: ['firstName'],
    });

    jest.spyOn(search, 'makeSearchService').mockReturnValue({
      listFields, query,
    } as search.SearchService);

  });

  describe('command: list', () => {
    let output;

    beforeEach(async () => {
      output = await handleCli([ '', '', 'list' ]);
    });

    it('should return formatted output', () => {
      const expected = [
        `Available Fields`,
        'FIELDS', '------', 'firstName', '',
      ];
      expect(output.flat()).toEqual(expected);
    });

    it('calls searchService.listFields', () => {
      expect(listFields).toHaveBeenCalled();
    });
  });

  describe('command: search', () => {
    describe('when all required options is NOT provided', () => {
      const mockConsoleError = jest.fn();
      let output;

      beforeEach(async () => {
        console.error = mockConsoleError;

        try {
          await handleCli(['', '', 'search', '-f', '_id', '-q', '123']);
        } catch (err) {
          output = err;
        }
      });

      it('should log error', () => {
        expect(mockConsoleError)
          .toHaveBeenCalledWith(`error: required option '-t, --contentType <type>' not specified`);
      });

      it('should show program help', () => {

        expect(output).toEqual('Invalid command');
      });
    });

    describe('when all required options are provided', () => {
      let output;

      describe('and there are results', () => {
        beforeEach(async () => {
          query.mockResolvedValue([
            {_id: '123', name: 'bulks'},
          ]);

          output = await handleCli(['', '', 'search', '-t', 'users', '-f', '_id', '-q', '123']);
        });

        it('should formatted results', () => {
          const expected = [
            'USERS', '-----', '',
            '_id'.padEnd(50) + '123',
            'name'.padEnd(50) + 'bulks',
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
            query: 'abc123',
          });
        });
      });
    });
  });
});
