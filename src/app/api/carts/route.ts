import {cookies} from 'next/headers'
import {type NextRequest} from 'next/server'
import {getBackendUrl} from '../../../shared'
import {errorMessage} from '../_shared/proxyToBackend'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

function publishableApiKey(): string | undefined {
	const fromEnv = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

	return typeof fromEnv === 'string' && fromEnv.length > 0
		? fromEnv
		: undefined
}

async function GET(request: NextRequest) {
	try {
		const id = request.nextUrl.searchParams.get('id')
		if (!id) {
			return Response.json({error: 'Не задан id корзины'}, {status: 400})
		}

		const headers = new Headers()
		const key = publishableApiKey()
		if (key) {
			headers.set('x-publishable-api-key', key)
		}

		const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value
		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}

		const res = await fetch(`${getBackendUrl()}/store/carts/${id}`, {
			headers,
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

async function POST(request: NextRequest) {
	try {
		const body = await request.json().catch(() => ({})) as {
			region_id?: string,
		}
		const headers = new Headers({'Content-Type': 'application/json'})
		const key = publishableApiKey()
		if (key) {
			headers.set('x-publishable-api-key', key)
		}

		const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value
		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}

		const res = await fetch(`${getBackendUrl()}/store/carts`, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
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

export {GET, POST}
