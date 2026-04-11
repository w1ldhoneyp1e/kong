import {getApiBase} from '../../../shared'
import {type AdminOrder, type ListOrdersResult} from '../../order'
import {
	type AdminCustomer,
	type CreateCustomerPayload,
	type ListCustomersQuery,
	type ListCustomersResult,
	type UpdateCustomerPayload,
} from './types'

async function parseRes(res: Response): Promise<unknown> {
	const text = await res.text()

	if (!text) {
		return {}
	}

	try {
		return JSON.parse(text) as unknown
	}
	catch {
		throw new Error(res.ok
			? 'Ответ не JSON'
			: `HTTP ${res.status}: ${text.slice(0, 100)}`)
	}
}

function messageFromErrorData(data: unknown): string {
	if (!data || typeof data !== 'object') {
		return 'Ошибка запроса'
	}

	const o = data as {
		error?: unknown,
		message?: unknown,
	}
	const err = o.error
	if (typeof err === 'string' && err.length > 0) {
		return err
	}

	const msg = o.message
	if (typeof msg === 'string' && msg.length > 0) {
		return msg
	}

	return 'Ошибка запроса'
}

function buildCustomersQueryString(query?: ListCustomersQuery): string {
	if (!query) {
		return ''
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
		? `?${s}`
		: ''
}

function buildCustomerOrdersQueryString(query?: {
	limit?: number,
	offset?: number,
}): string {
	if (!query) {
		return ''
	}

	const params = new URLSearchParams()

	if (query.limit !== undefined) {
		params.set('limit', String(query.limit))
	}

	if (query.offset !== undefined) {
		params.set('offset', String(query.offset))
	}

	const s = params.toString()

	return s.length > 0
		? `?${s}`
		: ''
}

const adminCustomerApi = {
	listCustomers: async (query?: ListCustomersQuery): Promise<ListCustomersResult> => {
		const qs = buildCustomersQueryString(query)
		const res = await fetch(`${getApiBase()}/customers${qs}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as ListCustomersResult & {error?: string}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return {
			customers: data.customers ?? [],
			count: typeof data.count === 'number'
				? data.count
				: (data.customers ?? []).length,
		}
	},

	getCustomer: async (id: string): Promise<AdminCustomer> => {
		const res = await fetch(`${getApiBase()}/customers/${id}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {customer?: AdminCustomer}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		if (!data.customer) {
			throw new Error('Покупатель не найден')
		}

		return data.customer
	},

	createCustomer: async (payload: CreateCustomerPayload): Promise<AdminCustomer> => {
		const res = await fetch(`${getApiBase()}/customers`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {
			customer?: AdminCustomer,
			customers?: AdminCustomer[],
		}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (data.customer) {
			return data.customer
		}

		const first = data.customers?.[0]
		if (first) {
			return first
		}

		throw new Error('Ответ без покупателя')
	},

	updateCustomer: async (
		id: string,
		payload: UpdateCustomerPayload,
	): Promise<AdminCustomer> => {
		const res = await fetch(`${getApiBase()}/customers/${id}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {customer?: AdminCustomer}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (!data.customer) {
			throw new Error('Ответ без покупателя')
		}

		return data.customer
	},

	deleteCustomer: async (id: string): Promise<void> => {
		const res = await fetch(`${getApiBase()}/customers/${id}`, {
			method: 'DELETE',
			credentials: 'same-origin',
		})

		if (res.status === 204) {
			return
		}

		const raw = await parseRes(res)

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}
	},

	listCustomerOrders: async (
		customerId: string,
		query?: {
			limit?: number,
			offset?: number,
		},
	): Promise<ListOrdersResult> => {
		const qs = buildCustomerOrdersQueryString(query)
		const res = await fetch(
			`${getApiBase()}/customers/${customerId}/orders${qs}`,
			{credentials: 'same-origin'},
		)
		const data = (await parseRes(res)) as {
			orders?: AdminOrder[],
			count?: number,
		}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return {
			orders: data.orders ?? [],
			count: data.count,
		}
	},
}

export {adminCustomerApi}
