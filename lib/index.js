'use strict';

const fs = require('fs').promises;
const path = require('path');

async function recursiveSearch(source, destination, options={}, depth=0) {

	if (options.limit > 0 && depth >= options.limit) return;
	
	return fs.stat(`${destination}${source}`)
		.catch(err => {

			return fs.mkdir(`${destination}${source}`);

		})
		.then(isDirExists => {

			if (!isDirExists) {
				return fs.readdir(source);
			} else {

				if (options.force) {
					return fs.readdir(source);
				} else if (options.errorOnExist) {
					throw new Error(`ENOTEMPTY: directory exists , '${destination}${source}'`);
				} else {
					return [];
				}

			}

		})
		.then(contents => {

			let promises = [];

			for (let item of contents) {

				let copyItem = Promise.resolve()
					.then(() => {

						if (options.filter) {
							return options.filter(item);
						}

						return true;

					})
					.then(next => {

						if (next) {
							return copy(source, destination, options, item);
						}

					});

				promises.push(copyItem);

			}

			return Promise.all(promises);

		});

};

async function copy(source, destination, options, name) {

	if (name.indexOf('.') === -1) {

		return fs.mkdir(`${destination}${source}${name}/`)
			.then(() => {
				return recursiveSearch(`${source}${name}/`, destination, options, depth+1);
			});

	} else {

		return fs.copyFile(`${source}${name}`, `${destination}${source}${name}`);

	}

}

module.exports = recursiveSearch;