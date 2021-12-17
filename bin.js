#!/usr/bin/env node

const fs = require('fs/promises')
const path = require('path/posix')
const { performance } = require('perf_hooks')

// Util
const util = {
	requireUncached: (moduleName) => {
		delete require.cache[require.resolve(moduleName)]
		return require(moduleName)
	},
	starting: (taskName) => {
		console.log(`Starting '${taskName}'...`)
		return performance.now()
	},
	finished: (taskName, start) => {
		let elapsed = Math.round(performance.now() - start)
		elapsed = elapsed >= 1000 ? +(elapsed / 1000).toFixed(2) + ' s' : Math.round(elapsed) + ' ms'
		elapsed = elapsed.toString()
		console.log(`Finished '${taskName}' after ${elapsed}`)
	},
}

// Get data
const dataFile = path.resolve(process.argv[2])
const getData = () => util.requireUncached(dataFile)
let data = Object.entries(getData())

async function run() {
	const start = util.starting('copy')
	const glob = require('fast-glob')

	for (let [dst, src] of data) {
		src = Array.isArray(src) ? src : [src]
		await fs.mkdir(dst, { recursive: true })
		const files = await glob(src, { onlyFiles: false, markDirectories: true })
		const base = getBase(src)
		files.forEach(async (i) => {
			const dest = base.map((b) => (i.startsWith(b) ? i.replace(b, dst) : null)).filter((x) => x !== null)[0]
			if (dest.endsWith('/')) {
				await fs.mkdir(dest, { recursive: true })
			} else {
				await fs.copyFile(i, dest)
			}
		})
	}

	util.finished('copy', start)
}

function watch() {
	require('chokidar')
		.watch(dataFile, { ignoreInitial: true })
		.on('change', () => {
			setTimeout(async () => {
				data = Object.entries(getData())
				await run()
			}, 200)
		})
		.on('ready', () => console.log('Ready for changes'))
}

function getBase(src) {
	let base = []
	if (Array.isArray(src)) {
		src = src.filter((i) => !i.startsWith('!'))
		src.forEach((i) => {
			base.push(
				i
					.split('/')
					.filter((i) => !i.startsWith('*') && !i.endsWith('*'))
					.join('/')
			)
		})
	}
	return [...new Set(base)]
}

void (async () => (process.argv[3] === '--watch' ? watch() : await run()))()
