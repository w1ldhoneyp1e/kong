import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {getBackendUrl} from '../../../../shared'
import {type AccountMe} from '../_lib/accountMeTypes'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'
const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

type StaffMeResponse = {
	staff?: {
		id?: string,
		email?: string | null,
		roleCode?: string | null,
	},
	permissions?: string[],
}

function publishableApiKey(): string | undefined {
	const fromEnv = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
	if (typeof fromEnv === 'string' && fromEnv.length > 0) {
		return fromEnv
	}

	if (process.env.NODE_ENV === 'development') {
		return 'pk_test_123'
	}

	return undefined
}

function extractCustomerEmail(data: unknown): string | null {
	if (!data || typeof data !== 'object') {
		return null
	}

	const fromCustomer = (c: unknown): string | null => {
		if (!c || typeof c !== 'object') {
			return null
		}

		const e = (c as {email?: unknown}).email
		return typeof e === 'string' && e.length > 0
			? e
			: null
	}

	const root = data as {
		customer?: unknown,
		data?: unknown,
	}
	let email = fromCustomer(root.customer)
	if (email) {
		return email
	}

	const inner = root.data
	if (inner && typeof inner === 'object') {
		email = fromCustomer((inner as {customer?: unknown}).customer)
	}

	return email
}

async function fetchJson(url: string, token: string): Promise<{
	ok: boolean,
	data: unknown,
}> {
	const res = await fetch(url, {
		headers: {Authorization: `Bearer ${token}`},
		cache: 'no-store',
	})
	const data = await res.json().catch(() => ({}))

	return {
		ok: res.ok,
		data,
	}
}

async function fetchStoreCustomerMe(
	backendUrl: string,
	token: string,
): Promise<{
		ok: boolean,
		email: string | null,
	}> {
	const key = publishableApiKey()
	const headers: Record<string, string> = {
		Authorization: `Bearer ${token}`,
	}
	if (key) {
		headers['x-publishable-api-key'] = key
	}

	for (const path of ['/store/customers/me', '/customers/me'] as const) {
		const res = await fetch(`${backendUrl}${path}`, {
			headers,
			cache: 'no-store',
		})
		const data = await res.json().catch(() => ({}))
		if (res.ok) {
			return {
				ok: true,
				email: extractCustomerEmail(data),
			}
		}
	}

	return {
		ok: false,
		email: null,
	}
}

function meSuccessResponse(account: AccountMe) {
	return NextResponse.json({
		ok: true,
		actorType: account.actorType,
		account,
	})
}

async function resolveStaff(
	backendUrl: string,
	staffToken: string,
): Promise<AccountMe | null> {
	const {ok, data} = await fetchJson(`${backendUrl}/staff/me`, staffToken)
	if (!ok) {
		return null
	}

	const parsed = data as StaffMeResponse
	return {
		authenticated: true,
		actorType: 'staff',
		email: parsed.staff?.email ?? null,
		roleCode: parsed.staff?.roleCode ?? null,
		permissions: parsed.permissions ?? [],
	}
}

async function resolveCustomer(
	backendUrl: string,
	customerToken: string,
): Promise<AccountMe | null> {
	const customMe = await fetchJson(`${backendUrl}/customer/me`, customerToken)
	if (customMe.ok) {
		const parsed = customMe.data as {customer?: {email?: string | null}}
		return {
			authenticated: true,
			actorType: 'customer',
			email: parsed.customer?.email ?? null,
			roleCode: 'customer',
		}
	}

	const {ok, email} = await fetchStoreCustomerMe(backendUrl, customerToken)
	if (!ok) {
		return null
	}

	return {
		authenticated: true,
		actorType: 'customer',
		email,
		roleCode: 'customer',
	}
}

async function GET() {
	const backendUrl = getBackendUrl()
	const cookieStore = await cookies()
	const staffToken = cookieStore.get(STAFF_TOKEN_COOKIE)?.value
	const customerToken = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value

	if (staffToken) {
		const account = await resolveStaff(backendUrl, staffToken)
		if (account) {
			return meSuccessResponse(account)
		}
	}

	if (customerToken) {
		const account = await resolveCustomer(backendUrl, customerToken)
		if (account) {
			return meSuccessResponse(account)
		}
	}

	const account: AccountMe = {
		authenticated: false,
		actorType: 'guest',
		roleCode: 'guest',
		email: null,
	}

	return meSuccessResponse(account)
}

const dynamic = 'force-dynamic'

export {
	GET,
	dynamic,
}
