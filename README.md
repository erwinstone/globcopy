
# globcopy

Copy files based on glob patterns


## Installation

Install globcopy with npm

```bash
npm install @erwinstone/globcopy -g
```

## Usage/Examples

### cli:
data.json :
```json
{
	"vendor/bootstrap": "node_modules/bootstrap/dist/js/bootstrap.bundle.*",
	"vendor/summernote": [
		"node_modules/summernote/dist/**/*",
		"!node_modules/summernote/dist/**/*.{zip,txt}"
	]
}
```
```bash
globcopy data.json
globcopy data.json --watch
```

### javascript api:
```bash
npm install @erwinstone/globcopy
```
```javascript
import { globcopy, globcopyRaw } from '@erwinstone/globcopy'

await globcopy({
	path: './data.json',
})

// or

await globcopy({
	path: './data.json',
	watch: true,
})

// or

await globcopyRaw(
	JSON.stringify({
		'vendor/bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.bundle.*',
		'vendor/summernote': [
			'node_modules/summernote/dist/**/*',
			'!node_modules/summernote/dist/**/*.{zip,txt}'
		],
	})
)
```
