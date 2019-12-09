
const makeSearchService = ({ dataService }) => {
	const listFields = () => {
		return Promise.all([
			dataService.getKeysFromContentType('users'),
			dataService.getKeysFromContentType('tickets'),
			dataService.getKeysFromContentType('organizations')
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
}

module.exports = {
	makeSearchService
};