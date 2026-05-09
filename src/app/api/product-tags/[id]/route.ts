import {type NextRequest} from 'next/server'
import {errorMessage, proxyToCatalogBackend} from '../../_shared/proxyToBackend'

async function PUT(
	request: NextRequest,
	context: {params: Promise<{id: string}>},
) {
	const {id} = await context.params
	try {
		const body = await request.json()
		return proxyToCatalogBackend(`/product-tags/${id}`, {
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
	context: {params: Promise<{id: string}>},
) {
	const {id} = await context.params
	return proxyToCatalogBackend(`/product-tags/${id}`, {method: 'DELETE'})
}

export {
	PUT,
	DELETE,
}
