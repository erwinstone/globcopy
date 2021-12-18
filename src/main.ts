import { promises as fs } from 'fs'
import { posix as path } from 'path'
import { performance } from 'perf_hooks'
import glob from 'fast-glob'
import { watch as chokidar } from 'chokidar'

const log = {
	starting: (taskName: string) => {
		console.log(`Starting '${taskName}'...`)
		return performance.now()
	},
	finished: (taskName: string, start: number) => {
		let diff = Math.round(performance.now() - start)
		let elapsed = diff >= 1000 ? `${(diff / 1000).toFixed(2)} s` : `${Math.round(diff)} ms`
		elapsed = elapsed.toString()
		console.log(`Finished '${taskName}' after ${elapsed}`)
	},
}

async function run(data: null | Data = null, dataPath: null | globcopyParams['path'] = null) {
	const start = log.starting('copy')

	if (data === null) {
		const dataContent = await fs.readFile(dataPath, 'utf8')
		data = Object.entries(JSON.parse(dataContent))
	}

	for (let [dst, val] of data) {
		const src: string[] = Array.isArray(val) ? val : [val]
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

	log.finished('copy', start)
}

function getBase(src: string[]) {
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

function watch(dataPath: globcopyParams['path']) {
	chokidar(dataPath, { ignoreInitial: true })
		.on('change', () => setTimeout(async () => await run(null, dataPath), 200))
		.on('ready', () => console.log('Ready for changes'))
}

export async function globcopy(params: globcopyParams) {
	const dataPath = path.resolve(params.path)
	if (params.watch === true) {
		watch(dataPath)
	} else {
		await run(null, dataPath)
	}
}

export async function globcopyObj(dataContent: string) {
	const data: Data = Object.entries(JSON.parse(dataContent))
	await run(data)
}

interface globcopyParams {
	path: string
	watch?: boolean
}
type Data = [string, string | string[]][]
