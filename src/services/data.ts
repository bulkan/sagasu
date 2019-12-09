import * as fs from 'fs';
import * as path from 'path';
import JSONStream from 'JSONStream';


export const makeDataService = () => {
	const dataRoot = path.join(__dirname, '..', '..', 'data');
	const users = path.join(dataRoot, 'users.json');
	const organizations = path.join(dataRoot, 'organizations.json');
	const tickets = path.join(dataRoot, 'tickets.json');

	const contentTypeFilePaths = {
		users,
		organizations,
		tickets
	};

	const getKeysFromContentType = (contentType) => {
		if (!contentType || !contentType.length) {
			return Promise.reject(new Error(`Missing contentType`));
		}

		return new Promise((resolve, reject) => {
			const keyParser = JSONStream.parse([{ emitKey: true }]);
			const contentTypeFilePath = contentTypeFilePaths[contentType.toLowerCase()];
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
	};

	const filterByFieldAndValue = (contentType, field, query) => {
		if (!contentType || !field || !query) {
			return Promise.reject(new Error(`Missing params`));
		}

		const parser = JSONStream.parse('*');

		return new Promise((resolve, reject) => {
			const contentTypeFilePath = contentTypeFilePaths[contentType.toLowerCase()];
			const stream = fs.createReadStream(contentTypeFilePath)
				.pipe(parser);

			let results = [];

			stream.on('end', () => resolve(results));
			stream.on('error', reject);
			stream.on('data', data => {
				const val = data[field];

				if (val && val.toString().includes(query)) {
					results.push(data);
				}
			});
		});

	};

	return {
		getKeysFromContentType,
		filterByFieldAndValue
	}
};