import {cookies} from 'next/headers'
import {getBackendUrl} from '../../../../../shared'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function POST(
	request: Request,
	{params}: {params: Promise<{id: string}>},
) {
	const {id} = await params
	const headers = new Headers()
	headers.set('Content-Type', 'application/json')

	const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value
	if (token) {
		headers.set('Authorization', `Bearer ${token}`)
	}

	const body = await request.text()

	const res = await fetch(`${getBackendUrl()}/store/carts/${id}/complete`, {
		method: 'POST',
		headers,
		body,
		cache: 'no-store',
	})
	const data = await res.json().catch(() => ({}))
	return Response.json(data, {status: res.status})
}

export {POST}
