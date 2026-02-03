import {NextResponse} from 'next/server'

function getBackendUrl(): string {
	const url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
	if (!url) {
		throw new Error('NEXT_PUBLIC_MEDUSA_BACKEND_URL не задан')
	}

	return url
}

function errorMessage(e: unknown): string {
	if (e instanceof Error) {
		return e.cause instanceof Error ? e.cause.message : e.message
	}

	return 'Ошибка при запросе API'
}

async function proxyToBackend(
	path: string,
	init?: RequestInit,
): Promise<NextResponse> {
	try {
		const base = getBackendUrl()
		const res = await fetch(`${base}${path}`, {
			cache: 'no-store',
			headers: {Connection: 'close', ...init?.headers},
			...init,
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
	getBackendUrl,
	errorMessage,
	proxyToBackend,
}
