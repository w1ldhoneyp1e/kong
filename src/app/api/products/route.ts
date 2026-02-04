import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../_shared/proxyToBackend'

export async function GET() {
	return proxyToBackend('/products')
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		return proxyToBackend('/products', {
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
