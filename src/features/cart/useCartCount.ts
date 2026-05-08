'use client'

import {useCallback, useEffect, useState} from 'react'
import {
	CART_UPDATED_EVENT,
	type Cart,
	cartItemsCount,
	getStoredCartId,
} from './model'

function useCartCount(): number {
	const [count, setCount] = useState(0)

	const load = useCallback(async () => {
		const cartId = getStoredCartId()
		if (!cartId) {
			setCount(0)
			return
		}

		const res = await fetch(`/api/carts?id=${cartId}`)
		const data = await res.json().catch(() => ({})) as {cart?: Cart}
		if (res.ok && data.cart) {
			setCount(cartItemsCount(data.cart))
			return
		}

		setCount(0)
	}, [])

	useEffect(() => {
		load().catch(() => {
			setCount(0)
		})

		window.addEventListener(CART_UPDATED_EVENT, load)
		window.addEventListener('storage', load)

		return () => {
			window.removeEventListener(CART_UPDATED_EVENT, load)
			window.removeEventListener('storage', load)
		}
	}, [load])

	return count
}

export {useCartCount}
