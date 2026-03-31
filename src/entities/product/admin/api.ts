import {getApiBase} from '../../../shared'
import {
	type AdminProduct,
	type AdminTagOption,
	type CreateProductPayload,
	type UpdateProductPayload,
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

const adminProductApi = {
	listProducts: async (): Promise<AdminProduct[]> => {
		const res = await fetch(`${getApiBase()}/products`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {
			products?: AdminProduct[],
		}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return data.products ?? []
	},

	listTags: async (): Promise<AdminTagOption[]> => {
		const res = await fetch(`${getApiBase()}/product-tags`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {
			tags?: AdminTagOption[],
		}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		return data.tags ?? []
	},

	getProduct: async (id: string): Promise<AdminProduct> => {
		const res = await fetch(`${getApiBase()}/products/${id}`, {
			credentials: 'same-origin',
		})
		const data = (await parseRes(res)) as {product?: AdminProduct}

		if (!res.ok) {
			throw new Error(messageFromErrorData(data))
		}

		if (!data.product) {
			throw new Error('Товар не найден')
		}

		return data.product
	},

	createProduct: async (payload: CreateProductPayload): Promise<AdminProduct> => {
		const res = await fetch(`${getApiBase()}/products`, {
			method: 'POST',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {
			product?: AdminProduct,
			products?: AdminProduct[],
		}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (data.product) {
			return data.product
		}

		const first = data.products?.[0]
		if (first) {
			return first
		}

		throw new Error('Ответ без товара')
	},

	updateProduct: async (
		id: string,
		payload: UpdateProductPayload,
	): Promise<AdminProduct> => {
		const res = await fetch(`${getApiBase()}/products/${id}`, {
			method: 'PUT',
			credentials: 'same-origin',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(payload),
		})
		const raw = await parseRes(res)
		const data = raw as {product?: AdminProduct}

		if (!res.ok) {
			throw new Error(messageFromErrorData(raw))
		}

		if (!data.product) {
			throw new Error('Ответ без товара')
		}

		return data.product
	},

	deleteProduct: async (id: string): Promise<void> => {
		const res = await fetch(`${getApiBase()}/products/${id}`, {
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

export {adminProductApi}
