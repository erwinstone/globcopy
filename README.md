
# globcopy

Copy files based on glob patterns


## Installation

Install globcopy with npm

```bash
npm install @erwinstone/globcopy -g
```

## Usage/Examples

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
