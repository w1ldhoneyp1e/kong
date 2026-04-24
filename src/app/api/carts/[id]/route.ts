import {cookies} from 'next/headers'
import {type NextRequest} from 'next/server'
import {getBackendUrl} from '../../../../shared'
import {errorMessage} from '../../_shared/proxyToBackend'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

function publishableApiKey(): string | undefined {
	const fromEnv = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

	return typeof fromEnv === 'string' && fromEnv.length > 0
		? fromEnv
		: undefined
}

async function buildHeaders(contentType = false): Promise<Headers> {
	const headers = new Headers()
	if (contentType) {
		headers.set('Content-Type', 'application/json')
	}

	const key = publishableApiKey()
	if (key) {
		headers.set('x-publishable-api-key', key)
	}

	const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value
	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	return headers
}

async function GET(
	_request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	const headers = await buildHeaders()
	const res = await fetch(`${getBackendUrl()}/store/carts/${id}`, {
		headers,
		cache: 'no-store',
	})
	const data = await res.json().catch(() => ({}))
	return Response.json(data, {status: res.status})
}

async function PUT(
	request: NextRequest,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	try {
		const body = await request.json().catch(() => ({})) as {
			action?: 'add_line_item' | 'update_line_item' | 'remove_line_item',
			variant_id?: string,
			line_id?: string,
			quantity?: number,
		}
		const headers = await buildHeaders(true)
		let path = `${getBackendUrl()}/store/carts/${id}`
		let method = 'POST'
		let payload: Record<string, unknown> = {}

		if (body.action === 'update_line_item' && body.line_id) {
			path = `${path}/line-items/${body.line_id}`
			method = 'POST'
			payload = {
				quantity: body.quantity ?? 1,
			}
		}
		else if (body.action === 'remove_line_item' && body.line_id) {
			path = `${path}/line-items/${body.line_id}`
			method = 'DELETE'
		}
		else {
			path = `${path}/line-items`
			method = 'POST'
			payload = {
				variant_id: body.variant_id,
				quantity: body.quantity ?? 1,
			}
		}

		const res = await fetch(path, {
			method,
			headers,
			body: method === 'DELETE'
				? undefined
				: JSON.stringify(payload),
			cache: 'no-store',
		})
		const data = await res.json().catch(() => ({}))
		return Response.json(data, {status: res.status})
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
	const headers = await buildHeaders()
	const res = await fetch(`${getBackendUrl()}/store/carts/${id}`, {
		method: 'DELETE',
		headers,
		cache: 'no-store',
	})
	if (res.status === 204) {
		return new Response(null, {status: 204})
	}
	const data = await res.json().catch(() => ({}))
	return Response.json(data, {status: res.status})
}

export {
	DELETE, GET, PUT,
}
