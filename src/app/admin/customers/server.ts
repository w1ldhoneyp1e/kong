import {cookies} from 'next/headers'
import {
	type AdminCustomer,
	type ListCustomersQuery,
	type ListCustomersResult,
} from '../../../entities/customer'
import {getBackendUrl} from '../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

function buildCustomersPath(query?: ListCustomersQuery): string {
	if (!query) {
		return '/customers'
	}

	const params = new URLSearchParams()

	if (query.q) {
		params.set('q', query.q)
	}

	if (query.limit !== undefined) {
		params.set('limit', String(query.limit))
	}

	if (query.offset !== undefined) {
		params.set('offset', String(query.offset))
	}

	const s = params.toString()

	return s.length > 0
		? `/customers?${s}`
		: '/customers'
}

async function fetchAdminCustomersServer(
	query?: ListCustomersQuery,
): Promise<ListCustomersResult | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const path = buildCustomersPath(query)
		const res = await fetch(`${getBackendUrl()}${path}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as ListCustomersResult

		return {
			customers: data.customers ?? [],
			count: typeof data.count === 'number'
				? data.count
				: (data.customers ?? []).length,
		}
	}
	catch {
		return undefined
	}
}

async function fetchAdminCustomerServer(id: string): Promise<AdminCustomer | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/customers/${id}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as {customer?: AdminCustomer}

		return data.customer
	}
	catch {
		return undefined
	}
}

export {
	fetchAdminCustomerServer,
	fetchAdminCustomersServer,
}
