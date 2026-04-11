import {getApiBase} from '../../../shared'
import {
	type AdminOrder,
	type ListOrdersQuery,
	type ListOrdersResult,
	type UpdateOrderPayload,
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

function buildOrdersQueryString(query?: ListOrdersQuery): string {
	if (!query) {
		return ''
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
		? `?${s}`
		: ''
}

const adminOrderApi = {
	listOrders: async (query?: ListOrdersQuery): Promise<ListOrdersResult> => {
		const qs = buildOrdersQueryString(query)
		const res = await fetch(`${getApiBase()}/orders${qs}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as ListOrdersResult & {error?: string}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return {
			orders: data.orders ?? [],
			count: data.count,
		}
	},

	getOrder: async (id: string): Promise<AdminOrder> => {
		const res = await fetch(`${getApiBase()}/orders/${id}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {order?: AdminOrder}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		if (!data.order) {
			throw new Error('Заказ не найден')
		}

		return data.order
	},

	updateOrder: async (
		id: string,
		payload: UpdateOrderPayload,
	): Promise<AdminOrder> => {
		const res = await fetch(`${getApiBase()}/orders/${id}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {order?: AdminOrder}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (!data.order) {
			throw new Error('Ответ без заказа')
		}

		return data.order
	},

	deleteOrder: async (id: string): Promise<void> => {
		const res = await fetch(`${getApiBase()}/orders/${id}`, {
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
}

export {adminOrderApi}
