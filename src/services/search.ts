import { DataService } from './data';

export interface AvailableFields {
  users: string[];
  tickets: string[];
  organizations: string[];
}

export class SearchService {
  public dataService: DataService;

  constructor(dataService: DataService) {
    this.dataService = dataService;
  }

  public listFields(): Promise<AvailableFields> {
    return Promise.all([
      this.dataService.getKeysFromContentType({contentType: 'users' }),
      this.dataService.getKeysFromContentType({contentType: 'tickets' }),
      this.dataService.getKeysFromContentType({contentType: 'organizations' }),
    ])
    .then(([users, tickets, organizations]) => {
      return {
        users,
        tickets,
        organizations,
      } as AvailableFields;
    });
  }

  public query({ contentType, field, query }) {
    if (!contentType || !field ) {
      return Promise.reject(new Error(`Missing params`));
    }

    return this.dataService.queryByField({ contentType, field, query });
  }
}

export const makeSearchService = ({ dataService } ) => new SearchService(dataService);
