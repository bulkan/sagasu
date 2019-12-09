import { DataService } from './data';

export interface AvailableFields {
	users: Array<string>;
	tickets: Array<string>;
	organizations: Array<string>;
}

export interface SearchService  {
	listFields: () => Promise<AvailableFields>;
	query: () => Promise<any>;
}

export const makeSearchService = ({ dataService } : { dataService: DataService }) => {
	const listFields = () => {
		return Promise.all([
			dataService.getKeysFromContentType({contentType: 'users' }),
			dataService.getKeysFromContentType({contentType: 'tickets' }),
			dataService.getKeysFromContentType({contentType: 'organizations' })
		])
		.then(([users, tickets, organizations]) => {
			return {
				users,
				tickets,
				organizations
			};
		});
	};

	const query = async () => {

	};

	return {
		listFields,
		query
	};
};