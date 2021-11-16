const cp = require('../lib/index.js');
const fs = require('fs').promises;

const sourceDir = 'source/', destinationDir = 'destination/';

const tests = [
	{
		runTest: async function() {
			await cp(sourceDir, destinationDir);
		},
		checkValid: async function(source=sourceDir, destination=destinationDir) {

			const contentsList = await Promise.all([fs.readdir(`${sourceDir}`), fs.readdir(`${destinationDir}${sourceDir}`)]);

			let change = {}, checkDirs = [];

			contentsList.forEach(contents => {

				contents.forEach(content => {

					if (change[content]) {
						change[content]++;
					} else {
						change[content] = 1;
					}

					if (content.indexOf('.') === -1) {
						checkDirs.push(`${source}${content}/`);
					}

				});

			});

			for (let key in change) {

				if (change[key] !== 2) return 0;

			}

			if (checkDirs.length > 0) {

				let dirsResult = 1;

				checkDirs.forEach(async (dir) => {
					dirsResult *= await this.checkValid(dir);
				})

				return dirsResult;

			}

			return 1;

		},
		afterTest: async function() {
			await fs.rmdir(destinationDir, {recursive: true});
			await fs.mkdir(destinationDir);
		}
	}
];

try {

	tests.forEach(async (test, i) => {

		let run = await test.runTest();
		let result = await test.checkValid();

		if (result) {
			console.log(`Test ${i+1} OK`);
		} else {
			console.log(`Test ${i+1} FAILED`);
		}

		await test.afterTest();

	});

} catch(err) {
	console.error(err);
}