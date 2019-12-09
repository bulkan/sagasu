import * as fs from 'fs';
import * as path from 'path';
import JSONStream from 'JSONStream';


export class DataService {
	dataRoot = path.join(__dirname, '..', '..', 'data');
	users = path.join(this.dataRoot, 'users.json');
	organizations = path.join(this.dataRoot, 'organizations.json');
	tickets = path.join(this.dataRoot, 'tickets.json');

	contentTypeFilePaths = {
		users: this.users,
		organizations: this.organizations,
		tickets: this.tickets
	};

	public getKeysFromContentType({ contentType }: { contentType?: string }) {
		if (!contentType || !contentType.length) {
			return Promise.reject(new Error(`Missing contentType`));
		}

		return new Promise((resolve, reject) => {
			const keyParser = JSONStream.parse([{ emitKey: true }]);
			const contentTypeFilePath = this.contentTypeFilePaths[contentType.toLowerCase()];
			const stream = fs.createReadStream(contentTypeFilePath)
				.pipe(keyParser);

			let keys = new Set();

			stream.on('end', () => resolve([...keys]));
			stream.on('error', reject);
			stream.on('data', ({ value }) => {
				const newKeys = new Set(Object.keys(value));
				keys = new Set([...keys, ...newKeys]);
			});
		});
	}

	public queryByField({ contentType, field, query }): Promise<Array<object>>  {
		if (!contentType || !field || !query) {
			return Promise.reject(new Error(`Missing params`));
		}

		const parser = JSONStream.parse('*');

		return new Promise((resolve, reject) => {
			const contentTypeFilePath = this.contentTypeFilePaths[contentType.toLowerCase()];
			const stream = fs.createReadStream(contentTypeFilePath)
				.pipe(parser);

			let results = [];

			stream.on('end', () => resolve(results));
			stream.on('error', reject);
			stream.on('data', data => {
				const val = data[field];

				if (val && val.toString() === query) {
					results.push(data);
				}
			});
		});
	};
}

export const makeDataService = () => new DataService();
