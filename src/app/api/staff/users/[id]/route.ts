import {type NextRequest} from 'next/server'
import {errorMessage, proxyToBackend} from '../../../_shared/proxyToBackend'

async function GET(
	_request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	try {
		const {id} = await params
		if (!id) {
			return Response.json({error: 'Некорректный id'}, {status: 400})
		}

		return proxyToBackend(`/staff/users/${encodeURIComponent(id)}`)
	}
	catch (e) {
		return Response.json(
			{error: errorMessage(e)},
			{status: 500},
		)
	}
}

async function PATCH(
	request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	try {
		const {id} = await params
		if (!id) {
			return Response.json({error: 'Некорректный id'}, {status: 400})
		}

		const body = await request.json()

		return proxyToBackend(`/staff/users/${encodeURIComponent(id)}`, {
			method: 'PATCH',
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
	request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	try {
		const {id} = await params
		if (!id) {
			return Response.json({error: 'Некорректный id'}, {status: 400})
		}

		return proxyToBackend(`/staff/users/${encodeURIComponent(id)}`, {
			method: 'DELETE',
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
	DELETE, GET, PATCH,
}

