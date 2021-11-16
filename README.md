# Recursive Dir Copy

---

Asynchronous recursive copying file and directories. Work on Promises. Behavior is similar to `cp -r`
`copy(SOURCE, DESTINATION[, OPTIONS])`

## Usage

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

* `options.limit` is a maximum recursion depth 