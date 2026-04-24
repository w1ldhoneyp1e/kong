'use client'

import {useState} from 'react'
import {Button} from '../../../shared'

const CART_ID_KEY = 'kong_cart_id'

type AddToCartButtonProps = {
	variantId: string | null,
}

async function ensureCartId(): Promise<string> {
	const cached = localStorage.getItem(CART_ID_KEY)
	if (cached) {
		return cached
	}

	const res = await fetch('/api/carts', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({}),
	})
	const data = await res.json().catch(() => ({})) as {
		cart?: {id?: string},
	}
	if (!res.ok || typeof data.cart?.id !== 'string') {
		throw new Error('Не удалось создать корзину')
	}

	localStorage.setItem(CART_ID_KEY, data.cart.id)
	return data.cart.id
}

function AddToCartButton({variantId}: AddToCartButtonProps) {
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const handleClick = async () => {
		if (!variantId) {
			setMessage('У товара нет доступного варианта')
			return
		}

		setLoading(true)
		setMessage(null)
		try {
			const cartId = await ensureCartId()
			const res = await fetch(`/api/carts/${cartId}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					action: 'add_line_item',
					variant_id: variantId,
					quantity: 1,
				}),
			})
			if (!res.ok) {
				throw new Error('Не удалось добавить товар')
			}
			setMessage('Товар добавлен в корзину')
		}
		catch (e) {
			setMessage(e instanceof Error
				? e.message
				: 'Ошибка добавления в корзину')
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-2">
			<Button
				size="lg"
				className="w-full"
				onClick={handleClick}
				state={loading
					? 'loading'
					: 'default'}
			>
				{'Добавить в корзину'}
			</Button>
			{message && <p className="text-sm text-muted-foreground">{message}</p>}
		</div>
	)
}

export {AddToCartButton}
export type {AddToCartButtonProps}
