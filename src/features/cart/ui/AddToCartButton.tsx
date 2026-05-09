'use client'

import {
	Minus,
	Plus,
	Trash2,
} from 'lucide-react'
import {
	useEffect,
	useState,
} from 'react'
import {Button} from '../../../shared'
import {
	type Cart,
	emitCartUpdated,
	getStoredCartId,
	setStoredCartId,
} from '../model'

type AddToCartButtonProps = {
	variantId: string | null,
}

async function ensureCartId(): Promise<string> {
	const cached = getStoredCartId()
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

	setStoredCartId(data.cart.id)
	return data.cart.id
}

function AddToCartButton({variantId}: AddToCartButtonProps) {
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [quantity, setQuantity] = useState(0)
	const [lineId, setLineId] = useState<string | null>(null)

	const syncFromCart = async () => {
		const cartId = getStoredCartId()
		if (!cartId || !variantId) {
			setQuantity(0)
			setLineId(null)
			return
		}

		const res = await fetch(`/api/carts?id=${cartId}`)
		const data = await res.json().catch(() => ({})) as {cart?: Cart}
		const line = data.cart?.items?.find(item => item.variant_id === variantId)
		setQuantity(line?.quantity ?? 0)
		setLineId(line?.id ?? null)
	}

	useEffect(() => {
		syncFromCart().catch(() => undefined)
		if (!variantId) {
			return
		}

		const onCartUpdated = () => {
			syncFromCart().catch(() => undefined)
		}

		window.addEventListener('kong_cart_updated', onCartUpdated)
		return () => {
			window.removeEventListener('kong_cart_updated', onCartUpdated)
		}
	}, [variantId])

	const addOne = async () => {
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
			setQuantity(current => current + 1)
			emitCartUpdated()
			await syncFromCart()
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

	const updateQuantity = async (nextQuantity: number) => {
		if (!lineId) {
			return
		}

		const cartId = getStoredCartId()
		if (!cartId) {
			return
		}

		setLoading(true)
		setMessage(null)
		try {
			if (nextQuantity <= 0) {
				const res = await fetch(`/api/carts/${cartId}`, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						action: 'remove_line_item',
						line_id: lineId,
					}),
				})
				if (!res.ok) {
					throw new Error('Не удалось удалить товар')
				}
			}
			else {
				const res = await fetch(`/api/carts/${cartId}`, {
					method: 'PUT',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({
						action: 'update_line_item',
						line_id: lineId,
						quantity: nextQuantity,
					}),
				})
				if (!res.ok) {
					throw new Error('Не удалось обновить количество')
				}
			}

			emitCartUpdated()
			await syncFromCart()
		}
		catch (e) {
			setMessage(e instanceof Error
				? e.message
				: 'Ошибка корзины')
		}
		finally {
			setLoading(false)
		}
	}

	if (quantity > 0) {
		return (
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						disabled={loading}
						onClick={() => {
							updateQuantity(quantity - 1).catch(() => undefined)
						}}
					>
						<Minus className="size-4" />
					</Button>
					<div className="flex h-10 min-w-14 items-center justify-center rounded-md border px-3 text-sm font-medium">
						{quantity}
					</div>
					<Button
						type="button"
						variant="outline"
						size="icon-sm"
						disabled={loading}
						onClick={() => {
							updateQuantity(quantity + 1).catch(() => undefined)
						}}
					>
						<Plus className="size-4" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						disabled={loading}
						onClick={() => {
							updateQuantity(0).catch(() => undefined)
						}}
					>
						<Trash2 className="size-4 text-destructive" />
					</Button>
				</div>
				{message && <p className="text-sm text-muted-foreground">{message}</p>}
			</div>
		)
	}

	return (
		<div className="space-y-2">
			<Button
				size="lg"
				className="w-full"
				onClick={() => {
					addOne().catch(() => undefined)
				}}
				state={loading
					? 'loading'
					: variantId
						? 'default'
						: 'disabled'}
			>
				{'Добавить в корзину'}
			</Button>
			{message && <p className="text-sm text-muted-foreground">{message}</p>}
		</div>
	)
}

export {AddToCartButton}
export type {AddToCartButtonProps}
