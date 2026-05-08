'use client'

import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from '../../../shared'
import {
	clearStoredCartId,
	emitCartUpdated,
} from '../../../features/cart'

const CART_ID_KEY = 'kong_cart_id'

type CartItem = {
	id: string,
	quantity: number,
	unit_price?: number,
}

type Cart = {
	id: string,
	items?: CartItem[],
}

function CheckoutPage() {
	const [cart, setCart] = useState<Cart | null>(null)
	const [loading, setLoading] = useState(true)
	const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

	useEffect(() => {
		const load = async () => {
			const cartId = localStorage.getItem(CART_ID_KEY)
			if (!cartId) {
				setLoading(false)
				return
			}

			const res = await fetch(`/api/carts?id=${cartId}`)
			const data = await res.json().catch(() => ({})) as {cart?: Cart}
			if (res.ok && data.cart) {
				setCart(data.cart)
			}
			setLoading(false)
		}
		load().catch(() => undefined)
	}, [])

	const total = useMemo(() => {
		if (!cart?.items) {
			return 0
		}

		return cart.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0)
	}, [cart])

	const handleCheckout = async () => {
		if (!cart?.id) {
			return
		}

		setSubmitState('loading')
		const res = await fetch(`/api/carts/${cart.id}/complete`, {method: 'POST'})
		if (!res.ok) {
			setSubmitState('error')
			return
		}

		clearStoredCartId()
		emitCartUpdated()
		setSubmitState('done')
	}

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<h1 className="text-3xl font-semibold">{'Оформление заказа'}</h1>
			<div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>{'Контактные данные'}</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="sm:col-span-2">
							<Label htmlFor="checkout-email">{'Email'}</Label>
							<Input id="checkout-email" />
						</div>
						<div>
							<Label htmlFor="checkout-name">{'Имя'}</Label>
							<Input id="checkout-name" />
						</div>
						<div>
							<Label htmlFor="checkout-phone">{'Телефон'}</Label>
							<Input id="checkout-phone" />
						</div>
						<div className="sm:col-span-2">
							<Label htmlFor="checkout-address">{'Адрес доставки'}</Label>
							<Input id="checkout-address" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{'Подтверждение'}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{loading && <p className="text-sm text-muted-foreground">{'Загрузка корзины...'}</p>}
						{!loading && <p className="text-sm text-muted-foreground">{`Сумма: ${(total / 100).toFixed(2)} ₽`}</p>}
						{submitState === 'done' && <p className="text-sm text-muted-foreground">{'Заказ оформлен.'}</p>}
						{submitState === 'error' && <p className="text-sm text-destructive">{'Не удалось оформить заказ'}</p>}
						<Button
							className="w-full"
							onClick={handleCheckout}
							state={submitState === 'loading'
								? 'loading'
								: 'default'}
						>
							{'Подтвердить заказ'}
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export {CheckoutPage as default}
