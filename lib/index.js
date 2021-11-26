'use strict';

const fs = require('fs').promises;
const path = require('path');

async function recursiveSearch(source, destination, options={}, depth=0) {

	if (!path.isAbsolute(source)) {
		source = path.normalize(path.join(path.resolve(), source));
	}

	if (!path.isAbsolute(destination)) {
		destination = path.normalize(path.join(path.resolve(), destination));
	}

	const targetDirName = path.basename(source);
	const targetDirPath = path.normalize(path.join(destination, targetDirName));

	if (options.limit > 0 && depth >= options.limit) return;
	
	return fs.stat(targetDirPath)
		.catch(err => {

			return fs.mkdir(targetDirPath);

		})
		.then(isDirExists => {

			if (!isDirExists) {
				return fs.readdir(source);
			} else {

				if (options.force) {
					return fs.readdir(source);
				} else if (options.errorOnExist) {
					throw new Error(`ENOTEMPTY: directory exists , '${targetDirPath}'`);
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
							return copy(source, targetDirPath, options, item, depth);
						}

					});

				promises.push(copyItem);

			}

			return Promise.all(promises);

		})
		.catch(err => {
			throw err;
		});

};

async function copy(source, destination, options, name, depth) {

	const targetPathLast = path.normalize(path.join(source, name));
	const targetPathNew = path.normalize(path.join(destination, name));

	if (name.indexOf('.') === -1) {

		return recursiveSearch(targetPathLast, destination, options, depth+1);

	} else {

		return fs.copyFile(targetPathLast, targetPathNew);

	}

}

module.exports = recursiveSearch;
