import {cookies} from 'next/headers'
import {
	type AdminOrder,
	type ListOrdersQuery,
	type ListOrdersResult,
} from '../../../entities/order'
import {getBackendUrl} from '../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

function buildOrdersPath(query?: ListOrdersQuery): string {
	if (!query) {
		return '/orders'
	}

	const params = new URLSearchParams()

	if (query.status) {
		params.set('status', query.status)
	}

	if (query.customer_id) {
		params.set('customer_id', query.customer_id)
	}

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
		? `/orders?${s}`
		: '/orders'
}

async function fetchAdminOrdersServer(
	query?: ListOrdersQuery,
): Promise<ListOrdersResult | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const path = buildOrdersPath(query)
		const res = await fetch(`${getBackendUrl()}${path}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as ListOrdersResult

		return {
			orders: data.orders ?? [],
			count: data.count,
		}
	}
	catch {
		return undefined
	}
}

async function fetchAdminOrderServer(id: string): Promise<AdminOrder | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/orders/${id}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as {order?: AdminOrder}

		return data.order
	}
	catch {
		return undefined
	}
}

export {
	fetchAdminOrderServer,
	fetchAdminOrdersServer,
}
