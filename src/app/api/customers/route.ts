import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../_shared/proxyToBackend'

async function GET(req: NextRequest) {
	const search = req.nextUrl.search
	const path = search
		? `/customers${search}`
		: '/customers'

	return proxyToBackend(path)
}

async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		return proxyToBackend('/customers', {
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

export {GET, POST}
