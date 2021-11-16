# Recursive Dir Copy

---

Asynchronous recursive copying file and directories. Work on Promises. Behavior is similar to `cp -r`

## Usage

`copy(SOURCE, DESTINATION[, OPTIONS])`

```javascript
const copy = require('recursive-dir-copy');

copy(SOURCE, DESTINATION)
	.then(() => {
		console.log('Successfully copied');
	})
	.catch((err) => {
		console.error(err);
	});
```
### OR

```javascript
try {

	const copy = require('recursive-dir-copy');

	await copy(SOURCE, DESTINATION);
	console.log('Successfully copied');

} catch(err) {
	console.error(err);
}
```

## Options

* `options.limit<Number>` is a maximum recursion depth. `options.limit = 0` mean that recursion will not stop until all directories and files will be copied. Default: `0`
* `options.filter<Function>` is a function that run for every file/dir in `SOURCE`, have 1 argument - the name of file or directory. Return `true` to copy file/dir, `false` to ignore. Also can return `Promise` that resolve `true`/`false`. Default: `undefined`
* `options.force<Boolean>` overwrite dirs/files in `DESTINATION` that already exists if `true`. Default: `false`
* `options.errorOnExist<Boolean>` throw error if try to overwrite dirs/files in `DESTINATION` that already exists and if `options.force=false`. Default: `false` 

