import {type NextRequest, NextResponse} from 'next/server'
import {getBackendUrl} from '../../../../shared'
import {
	buildCustomerAccountPreview,
	buildStaffAccountPreview,
} from '../_lib/buildAccountPreview'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'
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

export async function POST(request: NextRequest) {
	const body = await parseBody(request)
	const {email, password} = body

	if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
		return NextResponse.json({error: 'Не задан email/password'}, {status: 400})
	}

	const baseUrl = getBackendUrl()

	const normalizedEmail = email.trim().toLowerCase()

	const staffRes = await fetch(`${baseUrl}/staff/login`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email: normalizedEmail,
			password,
		}),
		cache: 'no-store',
	})

	const staffData = await staffRes.json().catch(() => ({}))
	const staffToken = (staffData as any)?.token

	if (staffRes.ok && typeof staffToken === 'string') {
		const account = await buildStaffAccountPreview(staffToken)
		const response = NextResponse.json({
			ok: true,
			actorType: 'staff',
			account,
		})
		response.cookies.set(STAFF_TOKEN_COOKIE, staffToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 8,
		})
		response.cookies.delete(CUSTOMER_TOKEN_COOKIE)

		return response
	}

	const customerRes = await fetch(`${baseUrl}/auth/customer/emailpass`, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			email: normalizedEmail,
			password,
		}),
		cache: 'no-store',
	})
	const customerData = await customerRes.json().catch(() => ({}))
	const customerToken = (customerData as any)?.token

	if (!customerRes.ok || typeof customerToken !== 'string') {
		const message = (customerData as any)?.error
			?? (customerData as any)?.message
			?? (staffData as any)?.error
			?? (staffData as any)?.message
			?? 'Ошибка входа'

		return NextResponse.json({error: message}, {status: 401})
	}

	const account = await buildCustomerAccountPreview(customerToken)
	const response = NextResponse.json({
		ok: true,
		actorType: 'customer',
		account,
	})
	response.cookies.set(CUSTOMER_TOKEN_COOKIE, customerToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
	})
	response.cookies.delete(STAFF_TOKEN_COOKIE)

	return response
}

