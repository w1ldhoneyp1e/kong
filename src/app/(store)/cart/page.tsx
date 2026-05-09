'use client'

import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {
	Minus,
	Plus,
	Trash2,
} from 'lucide-react'
import {
	type Cart,
	cartItemsCount,
	cartItemsTotal,
	emitCartUpdated,
	formatCartMoney,
	getStoredCartId,
} from '../../../features/cart'
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Link,
} from '../../../shared'

function CartPage() {
	const [cart, setCart] = useState<Cart | null>(null)
	const [commerceEnabled, setCommerceEnabled] = useState(true)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [pendingLineId, setPendingLineId] = useState<string | null>(null)

	useEffect(() => {
		const load = async () => {
			const cartId = getStoredCartId()
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

	useEffect(() => {
		fetch('/api/store')
			.then(res => res.json().catch(() => ({})))
			.then((data: {store?: {commerce_enabled?: boolean}}) => {
				setCommerceEnabled(data.store?.commerce_enabled !== false)
			})
			.catch(() => {
				setCommerceEnabled(true)
			})
	}, [])

	const total = useMemo(() => {
		return cartItemsTotal(cart)
	}, [cart])

	const itemsCount = useMemo(() => {
		return cartItemsCount(cart)
	}, [cart])

	const updateLineQuantity = async (lineId: string, quantity: number) => {
		if (!cart?.id || quantity < 1) {
			return
		}

		setPendingLineId(lineId)
		setError(null)
		try {
			const res = await fetch(`/api/carts/${cart.id}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					action: 'update_line_item',
					line_id: lineId,
					quantity,
				}),
			})
			const data = await res.json().catch(() => ({})) as {cart?: Cart, error?: string}
			if (!res.ok || !data.cart) {
				throw new Error(data.error ?? 'Не удалось обновить корзину')
			}
			setCart(data.cart)
			emitCartUpdated()
		}
		catch (e) {
			setError(e instanceof Error
				? e.message
				: 'Не удалось обновить корзину')
		}
		finally {
			setPendingLineId(null)
		}
	}

	const removeLine = async (lineId: string) => {
		if (!cart?.id) {
			return
		}

		setPendingLineId(lineId)
		setError(null)
		try {
			const res = await fetch(`/api/carts/${cart.id}`, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					action: 'remove_line_item',
					line_id: lineId,
				}),
			})
			const data = await res.json().catch(() => ({})) as {cart?: Cart, error?: string}
			if (!res.ok || !data.cart) {
				throw new Error(data.error ?? 'Не удалось удалить товар')
			}
			setCart(data.cart)
			emitCartUpdated()
		}
		catch (e) {
			setError(e instanceof Error
				? e.message
				: 'Не удалось удалить товар')
		}
		finally {
			setPendingLineId(null)
		}
	}

	const hasItems = itemsCount > 0

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
							{!commerceEnabled && (
								<p className="mb-4 text-sm text-muted-foreground">
									{'Покупка на сайте сейчас отключена. Цены скрыты, оформление заказа недоступно.'}
								</p>
							)}
							{loading && <p className="text-muted-foreground text-center py-8">{'Загрузка...'}</p>}
							{error && (
								<p
									className="mb-4 text-sm text-destructive"
									role="alert"
								>
									{error}
								</p>
							)}
							{!loading && (!cart?.items || cart.items.length === 0) && (
								<p className="text-muted-foreground text-center py-8">{'Корзина пуста'}</p>
							)}
							{!loading && cart?.items && cart.items.length > 0 && (
								<div className="space-y-4">
									{cart.items.map(item => (
										<div
											key={item.id}
											className="grid gap-3 border-b pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_auto_auto]"
										>
											<div className="min-w-0">
												<p className="font-medium">{item.title ?? 'Товар'}</p>
												{item.variant?.title
													? (
														<p className="text-sm text-muted-foreground">
															{item.variant.title}
														</p>
													)
													: null}
												{item.variant?.sku
													? (
														<p className="text-xs text-muted-foreground">
															{`SKU: ${item.variant.sku}`}
														</p>
													)
													: null}
												<p className="mt-1 text-sm text-muted-foreground">
													{commerceEnabled
														? `Цена: ${formatCartMoney(item.unit_price ?? 0)}`
														: 'Цена скрыта'}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Button
													type="button"
													variant="outline"
													size="icon-sm"
													aria-label="Уменьшить количество"
													disabled={pendingLineId === item.id || item.quantity <= 1}
													onClick={() => {
														updateLineQuantity(item.id, item.quantity - 1).catch(() => undefined)
													}}
												>
													<Minus className="size-4" />
												</Button>
												<span className="min-w-8 text-center text-sm font-medium">
													{item.quantity}
												</span>
												<Button
													type="button"
													variant="outline"
													size="icon-sm"
													aria-label="Увеличить количество"
													disabled={pendingLineId === item.id}
													onClick={() => {
														updateLineQuantity(item.id, item.quantity + 1).catch(() => undefined)
													}}
												>
													<Plus className="size-4" />
												</Button>
											</div>
											<div className="flex items-center justify-between gap-3 sm:min-w-32 sm:justify-end">
												<div className="font-semibold">
													{commerceEnabled
														? formatCartMoney(item.total ?? (item.unit_price ?? 0) * item.quantity)
														: '—'}
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon-sm"
													aria-label="Удалить товар"
													disabled={pendingLineId === item.id}
													onClick={() => {
														removeLine(item.id).catch(() => undefined)
													}}
												>
													<Trash2 className="size-4 text-destructive" />
												</Button>
											</div>
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
									<span className="font-semibold">{commerceEnabled
										? formatCartMoney(total)
										: '—'}</span>
								</div>
								<div className="flex justify-between">
									<span>{'Доставка:'}</span>
									<span className="font-semibold">{commerceEnabled
										? formatCartMoney(0)
										: '—'}</span>
								</div>
								<div className="border-t pt-2 mt-2">
									<div className="flex justify-between text-lg font-bold">
										<span>{'Всего:'}</span>
										<span>{commerceEnabled
											? formatCartMoney(total)
											: '—'}</span>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter>
							{hasItems && commerceEnabled
								? (
									<Link
										href="/checkout"
										className="w-full inline-flex items-center justify-center rounded-md border px-4 py-2"
									>
										{'Оформить заказ'}
									</Link>
								)
								: (
									<Button
										type="button"
										className="w-full"
										state="disabled"
									>
										{'Оформить заказ'}
									</Button>
								)}
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	)
}

export {CartPage as default}
