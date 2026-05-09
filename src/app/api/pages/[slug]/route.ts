import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../../_shared/proxyToBackend'

export async function GET(
	_request: NextRequest,
	context: {params: Promise<{slug: string}>},
) {
	const {slug} = await context.params
	return proxyToBackend(`/pages/${slug}`)
}

export async function PUT(
	request: NextRequest,
	context: {params: Promise<{slug: string}>},
) {
	const {slug} = await context.params
	try {
		const body = await request.json()
		return proxyToBackend(`/pages/${slug}`, {
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
