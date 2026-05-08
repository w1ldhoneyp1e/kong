import {cookies} from 'next/headers'
import {type NextRequest} from 'next/server'
import {getBackendUrl} from '../../../shared'
import {errorMessage} from '../_shared/proxyToBackend'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function GET(request: NextRequest) {
	try {
		const id = request.nextUrl.searchParams.get('id')
		if (!id) {
			return Response.json({error: 'Не задан id корзины'}, {status: 400})
		}

		const headers = new Headers()

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
