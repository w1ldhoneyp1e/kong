'use client'

import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Link,
} from '../../../shared'

const CART_ID_KEY = 'kong_cart_id'

type CartLine = {
	id: string,
	title?: string,
	quantity: number,
	unit_price?: number,
}

type Cart = {
	id: string,
	items?: CartLine[],
}

function CartPage() {
	const [cart, setCart] = useState<Cart | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const load = async () => {
			const cartId = localStorage.getItem(CART_ID_KEY)
			if (!cartId) {
				setLoading(false)
				return
			}

			const res = await fetch(`/api/carts?id=${cartId}`)
			const data = await res.json().catch(() => ({})) as {
				cart?: Cart,
			}
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

	return (
		<div className="container mx-auto px-4 py-12">
			<h1 className="text-4xl font-bold mb-8">{'Корзина'}</h1>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>{'Товары'}</CardTitle>
						</CardHeader>
						<CardContent>
							{loading && <p className="text-muted-foreground text-center py-8">{'Загрузка...'}</p>}
							{!loading && (!cart?.items || cart.items.length === 0) && (
								<p className="text-muted-foreground text-center py-8">{'Корзина пуста'}</p>
							)}
							{!loading && cart?.items && cart.items.length > 0 && (
								<div className="space-y-4">
									{cart.items.map(item => (
										<div
											key={item.id}
											className="flex items-center justify-between"
										>
											<div>
												<p>{item.title ?? 'Товар'}</p>
												<p className="text-sm text-muted-foreground">{`Количество: ${item.quantity}`}</p>
											</div>
											<div>{`${((item.unit_price ?? 0) * item.quantity / 100).toFixed(2)} ₽`}</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
				<div>
					<Card>
						<CardHeader>
							<CardTitle>{'Итого'}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span>{'Товары:'}</span>
									<span className="font-semibold">{`${(total / 100).toFixed(2)} ₽`}</span>
								</div>
								<div className="flex justify-between">
									<span>{'Доставка:'}</span>
									<span className="font-semibold">{'0 ₽'}</span>
								</div>
								<div className="border-t pt-2 mt-2">
									<div className="flex justify-between text-lg font-bold">
										<span>{'Всего:'}</span>
										<span>{`${(total / 100).toFixed(2)} ₽`}</span>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Link
								href="/checkout"
								className="w-full inline-flex items-center justify-center rounded-md border px-4 py-2 disabled:opacity-50"
							>
								{'Оформить заказ'}
							</Link>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}

export {CartPage as default}

