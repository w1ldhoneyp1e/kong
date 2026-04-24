import {cookies} from 'next/headers'
import {getBackendUrl} from '../../../../shared'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

function publishableApiKey(): string | undefined {
	const fromEnv = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

	return typeof fromEnv === 'string' && fromEnv.length > 0
		? fromEnv
		: undefined
}

async function GET() {
	const headers = new Headers()
	const key = publishableApiKey()
	if (key) {
		headers.set('x-publishable-api-key', key)
	}

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
