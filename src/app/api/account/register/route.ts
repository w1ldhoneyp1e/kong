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

async function registerCustomer(params: {
	baseUrl: string,
	email: string,
	password: string,
	firstName: string,
	lastName: string,
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
		}),
		cache: 'no-store',
	})

	const regData = await regRes.json().catch(() => ({}))

	if (!regRes.ok) {
		throw new Error((regData as any)?.error ?? (regData as any)?.message ?? `HTTP ${regRes.status}`)
	}

	const token = (regData as any)?.token
	if (typeof token !== 'string') {
		throw new Error('Медуса не вернула token при регистрации')
	}

	const createRes = await fetch(`${baseUrl}/customers`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			email,
			first_name: firstName,
			last_name: lastName,
		}),
		cache: 'no-store',
	})

	if (!createRes.ok) {
		return token
	}
	return token
}

export async function POST(request: NextRequest) {
	const body = await parseBody(request)
	const {
		email, password, firstName, lastName,
	} = body

	if (!email || typeof email !== 'string' || !password || typeof password !== 'string'
		|| !firstName || typeof firstName !== 'string' || !lastName || typeof lastName !== 'string') {
		return NextResponse.json({error: 'Заполни email, пароль, имя и фамилию'}, {status: 400})
	}

	const baseUrl = getBackendUrl()

	try {
		const token = await registerCustomer({
			baseUrl,
			email: email.trim().toLowerCase(),
			password,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
		})

		const account = await buildCustomerAccountPreview(token)
		const response = NextResponse.json({
			ok: true,
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

