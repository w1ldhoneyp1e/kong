import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {getBackendUrl} from '../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'
const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

function errorMessage(e: unknown): string {
	if (e instanceof Error) {
		return e.cause instanceof Error
			? e.cause.message
			: e.message
	}

	return 'Ошибка при запросе API'
}

function buildProxyHeaders(
	initHeaders: HeadersInit | undefined,
	staffToken: string | undefined,
	customerToken: string | undefined,
) {
	const headers = new Headers(initHeaders)
	const hasAuth = headers.has('Authorization') || headers.has('authorization')

	if (!hasAuth && staffToken) {
		headers.set('Authorization', `Bearer ${staffToken}`)
	}
	else if (!hasAuth && customerToken) {
		headers.set('Authorization', `Bearer ${customerToken}`)
	}

	if (!headers.has('Connection')) {
		headers.set('Connection', 'close')
	}

	return headers
}

async function proxyToBackend(
	path: string,
	init?: RequestInit,
): Promise<NextResponse> {
	try {
		const base = getBackendUrl()
		const staffToken = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
		const customerToken = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value

		const headers = buildProxyHeaders(init?.headers, staffToken, customerToken)

		const res = await fetch(`${base}${path}`, {
			...init,
			cache: 'no-store',
			headers,
		})

		if (res.status === 204 || (res.ok && res.headers.get('content-length') === '0')) {
			return new NextResponse(null, {status: 204})
		}

		const data = await res.json().catch(() => ({}))

		if (!res.ok) {
			return NextResponse.json(
				data?.message ?? data?.error ?? {error: `HTTP ${res.status}`},
				{status: res.status},
			)
		}

		return NextResponse.json(data, {status: res.status})
	}
	catch (e) {
		return NextResponse.json(
			{error: errorMessage(e)},
			{status: 500},
		)
	}
}

export {
	errorMessage,
	proxyToBackend,
}
