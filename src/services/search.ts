import { DataService } from './data';

export interface AvailableFields {
	users: Array<string>;
	tickets: Array<string>;
	organizations: Array<string>;
}

export class SearchService {
	dataService: DataService;

	constructor(dataService: DataService) {
		this.dataService = dataService;
	}

	public listFields() : Promise<AvailableFields> {
		return Promise.all([
			this.dataService.getKeysFromContentType({contentType: 'users' }),
			this.dataService.getKeysFromContentType({contentType: 'tickets' }),
			this.dataService.getKeysFromContentType({contentType: 'organizations' })
		])
		.then(([users, tickets, organizations]) => {
			return {
				users,
				tickets,
				organizations
			} as AvailableFields;
		});
	}

	public query() {

	}
}

export const makeSearchService = ({ dataService } ) => new SearchService(dataService);