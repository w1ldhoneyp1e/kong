import {cookies} from 'next/headers'
import {type AdminProduct} from '../../../entities/product'
import {getBackendUrl} from '../../../shared'

const STAFF_TOKEN_COOKIE = 'kong_staff_token'

async function fetchAdminProductsServer(): Promise<AdminProduct[] | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/products`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as {products?: AdminProduct[]}

		return data.products
	}
	catch {
		return undefined
	}
}

async function fetchAdminProductServer(id: string): Promise<AdminProduct | undefined> {
	const token = (await cookies()).get(STAFF_TOKEN_COOKIE)?.value
	if (!token) {
		return undefined
	}

	try {
		const res = await fetch(`${getBackendUrl()}/products/${id}`, {
			headers: {Authorization: `Bearer ${token}`},
			cache: 'no-store',
		})
		if (!res.ok) {
			return undefined
		}

		const data = (await res.json()) as {product?: AdminProduct}

		return data.product
	}
	catch {
		return undefined
	}
}

export {
	fetchAdminProductsServer,
	fetchAdminProductServer,
}
