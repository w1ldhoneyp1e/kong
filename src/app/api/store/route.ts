import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../_shared/proxyToBackend'

async function GET() {
	return proxyToBackend('/store')
}

async function PUT(request: NextRequest) {
	try {
		const body = await request.json()
		return proxyToBackend('/store', {
			method: 'PUT',
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

export {GET, PUT}
