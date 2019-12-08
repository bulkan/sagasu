const fs = require('fs');
const path = require('path');
const JSONStream = require('JSONStream');

const dataRoot = path.join(__dirname, '..', '..', 'data');
const users = path.join(dataRoot, 'users.json');
const organizations = path.join(dataRoot, 'organizations.json');
const tickets = path.join(dataRoot, 'tickets.json');

const makeDataService = () => {
	const keyParser = JSONStream.parse([{ emitKey: true }]);

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
			const contentTypeFilePath = contentTypeFilePaths[contentType.toLowerCase()];
			const stream = fs.createReadStream(contentTypeFilePath)
				.pipe(keyParser);

			let keys = new Set();

			stream.on('end', () => resolve([...keys]) );
			stream.on('error', reject);
			stream.on('data', ({ value }) => {
				const newKeys = new Set(Object.keys(value));
				keys = new Set([...keys, ...newKeys]);
			});
		});
	};

	return {
		getKeysFromContentType
	}
};

module.exports = {
	makeDataService
};