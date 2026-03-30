import {type NextRequest, NextResponse} from 'next/server'
import {getBackendUrl} from '../../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

async function parseBody(request: NextRequest): Promise<{
	email?: string,
	password?: string,
}> {
	const body = await request.json().catch(() => ({}))
	if (!body || typeof body !== 'object') {
		return {}
	}
	return body as {
		email?: string,
		password?: string,
	}
}

async function POST(request: NextRequest) {
	const {email, password} = await parseBody(request)
	if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
		return NextResponse.json({error: 'Не задан email/password'}, {status: 400})
	}

	const base = getBackendUrl()
	const res = await fetch(`${base}/staff/login`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email,
			password,
		}),
		cache: 'no-store',
	})

	const data = await res.json().catch(() => ({}))

	if (!res.ok || typeof (data as any).token !== 'string') {
		return NextResponse.json(
			{error: (data as any)?.error ?? 'Ошибка логина'},
			{status: res.status},
		)
	}

	const token = (data as any).token as string

	const response = NextResponse.json({ok: true})
	response.cookies.set(STAFF_TOKEN_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 8,
	})
	return response
}

export {POST}

