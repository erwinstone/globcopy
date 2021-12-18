const fs = require('fs/promises')
const pkg = require('./package.json')
const esbuild = require('esbuild')

const banner = `/*!
* ${pkg.name} v${pkg.version} (${pkg.homepage})
* Copyright ${new Date().getFullYear()} ${pkg.author}
* Licensed under ${pkg.license} (${pkg.repository.replace('.git', '')}/blob/master/LICENSE)
*/`

const watchMode = process.argv.includes('--watch')
const watch = watchMode ? {
	onRebuild(error) {
		if (error) console.error('Build failed: ', error)
		else console.log('Build finished')
	},
} : false

void (async () => {
	if (!watchMode) {
		await fs.rm('dist', {
			force: true,
			recursive: true,
		})
	}
	await Promise.all([
		esbuild.build({
			entryPoints: [pkg.source],
			platform: 'node',
			outfile: pkg.main,
			format: 'cjs',
			minify: true,
			banner: { js: banner },
			watch,
		}),
		esbuild.build({
			entryPoints: [pkg.source],
			platform: 'node',
			outfile: pkg.module,
			format: 'esm',
			minify: true,
			banner: { js: banner },
			watch,
		}),
		esbuild.build({
			entryPoints: [pkg.source.replace('main.ts', 'bin.ts')],
			platform: 'node',
			outfile: pkg.bin,
			format: 'cjs',
			minify: true,
			watch,
		}),
	])
	console.log(watchMode ? 'Watching ts...' : 'Build finished')
})()
