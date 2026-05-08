import {cookies} from 'next/headers'
import {getBackendUrl} from '../../../../shared'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function GET() {
	const headers = new Headers()

	const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value
	if (!token) {
		return Response.json({orders: []}, {status: 200})
	}

	headers.set('Authorization', `Bearer ${token}`)
	const res = await fetch(`${getBackendUrl()}/store/orders`, {
		headers,
		cache: 'no-store',
	})
	const data = await res.json().catch(() => ({}))
	return Response.json(data, {status: res.status})
}

export {GET}
