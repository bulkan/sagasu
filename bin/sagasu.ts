#!/usr/bin/env -S npx ts-script

import { handleCli } from '../src/cli';

function main() {
	handleCli(process.argv)
		.then(result => {
			console.log(result);
		})
		.catch(err => {
			console.error(err);
			process.exit(1);
		});
}

if (require.main === module) {
  main();
}