import {type NextRequest, NextResponse} from 'next/server'
import {getBackendUrl} from '../../../../shared'
import {buildCustomerAccountPreview} from '../_lib/buildAccountPreview'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function parseBody(request: NextRequest): Promise<{
	email?: string,
	password?: string,
	firstName?: string,
	lastName?: string,
}> {
	const body = await request.json().catch(() => ({}))
	if (!body || typeof body !== 'object') {
		return {}
	}

	return body as {
		email?: string,
		password?: string,
		firstName?: string,
		lastName?: string,
	}
}

function messageFromRegisterError(data: unknown, fallback: string): string {
	if (!data || typeof data !== 'object') {
		return fallback
	}

	const candidate = data as {
		error?: unknown,
		message?: unknown,
	}

	if (typeof candidate.error === 'string' && candidate.error.trim()) {
		return candidate.error
	}

	if (typeof candidate.message === 'string' && candidate.message.trim()) {
		return candidate.message
	}

	if (Array.isArray(candidate.message)) {
		const text = candidate.message
			.filter(item => typeof item === 'string' && item.trim())
			.join(', ')
		if (text) {
			return text
		}
	}

	return fallback
}

async function registerCustomer(params: {
	baseUrl: string,
	email: string,
	password: string,
	firstName: string,
	lastName?: string,
}): Promise<string> {
	const {
		baseUrl, email, password, firstName, lastName,
	} = params

	const regRes = await fetch(`${baseUrl}/auth/customer/emailpass/register`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email,
			password,
			first_name: firstName,
			last_name: lastName || undefined,
		}),
		cache: 'no-store',
	})

	const regData = await regRes.json().catch(() => ({}))

	if (!regRes.ok) {
		throw new Error(messageFromRegisterError(regData, `HTTP ${regRes.status}`))
	}

	const token = (regData as any)?.token
	if (typeof token !== 'string') {
		throw new Error('Backend не вернул token при регистрации')
	}
	return token
}

export async function POST(request: NextRequest) {
	const body = await parseBody(request)
	const {
		email, password, firstName, lastName,
	} = body

	if (!email || typeof email !== 'string' || !password || typeof password !== 'string'
		|| !firstName || typeof firstName !== 'string') {
		return NextResponse.json({error: 'Заполни email, пароль и имя'}, {status: 400})
	}

	const baseUrl = getBackendUrl()

	try {
		const token = await registerCustomer({
			baseUrl,
			email: email.trim().toLowerCase(),
			password,
			firstName: firstName.trim(),
			lastName: typeof lastName === 'string'
				? lastName.trim()
				: undefined,
		})

		const account = await buildCustomerAccountPreview(token)
		const response = NextResponse.json({
			ok: true,
			actorType: 'customer',
			account,
		})
		response.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
		})
		return response
	}
	catch (e) {
		return NextResponse.json(
			{
				error: e instanceof Error
					? e.message
					: 'Ошибка регистрации',
			},
			{status: 400},
		)
	}
}
