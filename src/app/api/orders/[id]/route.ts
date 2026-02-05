import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../../_shared/proxyToBackend'

async function GET(
	_request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	return proxyToBackend(`/orders/${id}`)
}

async function PUT(
	request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	try {
		const body = await request.json()
		return proxyToBackend(`/orders/${id}`, {
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

async function DELETE(
	_request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	return proxyToBackend(`/orders/${id}`, {method: 'DELETE'})
}

export {
	DELETE, GET, PUT,
}
