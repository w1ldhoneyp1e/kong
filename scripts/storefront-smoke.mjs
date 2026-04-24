const baseUrl = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000'
const paths = ['/', '/catalog', '/cart', '/checkout', '/about', '/contacts']

async function run() {
	const failed = []

	for (const path of paths) {
		const response = await fetch(`${baseUrl}${path}`)
		if (!response.ok) {
			failed.push(`${path}: ${response.status}`)
		}
	}

	if (failed.length > 0) {
		throw new Error(`Smoke failed: ${failed.join(', ')}`)
	}

	console.log('Smoke passed')
}

run().catch(error => {
	console.error(error instanceof Error
		? error.message
		: 'Unknown smoke error')
	process.exit(1)
})
