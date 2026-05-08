import {type NextRequest} from 'next/server'
import {errorMessage, proxyToCatalogBackend} from '../_shared/proxyToBackend'

async function GET() {
	return proxyToCatalogBackend('/categories')
}

async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		return proxyToCatalogBackend('/categories', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body),
		})
	}
	catch (e) {
		return Response.json(
			{error: errorMessage(e)},
			{status: 500},
		)
	}
}

export {
	GET,
	POST,
}
