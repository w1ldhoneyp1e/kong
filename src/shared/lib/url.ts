function getBackendUrl(): string {
	const url = process.env.NEXT_PUBLIC_BACKEND_URL
		?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
	if (!url) {
		throw new Error('NEXT_PUBLIC_BACKEND_URL не задан')
	}

	return url
}

function getBackendUrlOptional(): string {
	return process.env.NEXT_PUBLIC_BACKEND_URL
		?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
		?? 'http://localhost:9000'
}

function getCatalogBackendUrl(): string {
	const url = process.env.NEXT_PUBLIC_BACKEND_URL
		?? process.env.NEXT_PUBLIC_CATALOG_BACKEND_URL
		?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
	if (!url) {
		throw new Error('NEXT_PUBLIC_CATALOG_BACKEND_URL не задан')
	}

	return url
}

function getCatalogBackendUrlOptional(): string {
	return process.env.NEXT_PUBLIC_BACKEND_URL
		?? process.env.NEXT_PUBLIC_CATALOG_BACKEND_URL
		?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
		?? 'http://localhost:9000'
}

function getApiBase(): string {
	if (typeof window !== 'undefined') {
		return '/api'
	}
	const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

	return `${origin}/api`
}

export {
	getBackendUrl,
	getBackendUrlOptional,
	getCatalogBackendUrl,
	getCatalogBackendUrlOptional,
	getApiBase,
}
