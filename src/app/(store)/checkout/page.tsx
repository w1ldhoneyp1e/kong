'use client'

import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {useRouter} from 'next/navigation'
import {clearStoredCartId, emitCartUpdated} from '../../../features/cart'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from '../../../shared'

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

type CheckoutForm = {
	email: string,
	firstName: string,
	lastName: string,
	phone: string,
	address: string,
	city: string,
	postalCode: string,
}

type CompleteCartResponse = {
	type?: 'order',
	order?: {
		id?: string,
	},
}

function CheckoutPage() {
	const router = useRouter()
	const [cart, setCart] = useState<Cart | null>(null)
	const [commerceEnabled, setCommerceEnabled] = useState(true)
	const [loading, setLoading] = useState(true)
	const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'error'>('idle')
	const [form, setForm] = useState<CheckoutForm>({
		email: '',
		firstName: '',
		lastName: '',
		phone: '',
		address: '',
		city: '',
		postalCode: '',
	})

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
		if (!cart?.items) {
			return 0
		}

		return cart.items.reduce((sum, item) => sum + (item.unit_price ?? 0) * item.quantity, 0)
	}, [cart])

	const handleCheckout = async () => {
		if (!cart?.id) {
			return
		}

		if (!commerceEnabled) {
			setSubmitState('error')
			return
		}

		if (!form.email.trim() || !form.firstName.trim() || !form.phone.trim() || !form.address.trim()) {
			setSubmitState('error')
			return
		}

		setSubmitState('loading')
		const res = await fetch(`/api/carts/${cart.id}/complete`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				email: form.email.trim().toLowerCase(),
				first_name: form.firstName.trim(),
				last_name: form.lastName.trim() || undefined,
				phone: form.phone.trim(),
				address_1: form.address.trim(),
				city: form.city.trim() || undefined,
				postal_code: form.postalCode.trim() || undefined,
				country_code: 'ru',
			}),
		})
		if (!res.ok) {
			setSubmitState('error')
			return
		}

		const data = await res.json().catch(() => ({})) as CompleteCartResponse

		clearStoredCartId()
		emitCartUpdated()
		setCart(null)
		router.push(data.order?.id
			? `/checkout/success?order=${encodeURIComponent(data.order.id)}`
			: '/checkout/success')
	}

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<h1 className="text-3xl font-semibold">{'Оформление заказа'}</h1>
			<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>{'Контактные данные'}</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{!commerceEnabled && (
							<p className="sm:col-span-2 text-sm text-muted-foreground">
								{'Покупка на сайте сейчас отключена. Цены скрыты, а оформление заказа недоступно.'}
							</p>
						)}
						<div className="sm:col-span-2">
							<Label htmlFor="checkout-email">{'Email'}</Label>
							<Input
								id="checkout-email"
								value={form.email}
								onChange={event => {
									setForm(current => ({
										...current,
										email: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div>
							<Label htmlFor="checkout-first-name">{'Имя'}</Label>
							<Input
								id="checkout-first-name"
								value={form.firstName}
								onChange={event => {
									setForm(current => ({
										...current,
										firstName: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div>
							<Label htmlFor="checkout-last-name">{'Фамилия'}</Label>
							<Input
								id="checkout-last-name"
								value={form.lastName}
								onChange={event => {
									setForm(current => ({
										...current,
										lastName: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div>
							<Label htmlFor="checkout-phone">{'Телефон'}</Label>
							<Input
								id="checkout-phone"
								value={form.phone}
								onChange={event => {
									setForm(current => ({
										...current,
										phone: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div className="sm:col-span-2">
							<Label htmlFor="checkout-address">{'Адрес доставки'}</Label>
							<Input
								id="checkout-address"
								value={form.address}
								onChange={event => {
									setForm(current => ({
										...current,
										address: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div>
							<Label htmlFor="checkout-city">{'Город'}</Label>
							<Input
								id="checkout-city"
								value={form.city}
								onChange={event => {
									setForm(current => ({
										...current,
										city: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
						<div>
							<Label htmlFor="checkout-postal-code">{'Индекс'}</Label>
							<Input
								id="checkout-postal-code"
								value={form.postalCode}
								onChange={event => {
									setForm(current => ({
										...current,
										postalCode: event.target.value,
									}))
								}}
								disabled={!commerceEnabled}
							/>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{'Подтверждение'}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{loading && <p className="text-sm text-muted-foreground">{'Загрузка корзины...'}</p>}
						{!loading && (
							<p className="text-sm text-muted-foreground">
								{commerceEnabled
									? `Сумма: ${(total / 100).toFixed(2)} ₽`
									: 'Сумма скрыта'}
							</p>
						)}
						{submitState === 'error' && (
							<p className="text-sm text-destructive">
								{commerceEnabled
									? 'Проверьте email, имя, телефон и адрес доставки.'
									: 'Оформление заказа сейчас отключено.'}
							</p>
						)}
						<Button
							className="w-full"
							onClick={handleCheckout}
							state={submitState === 'loading'
								? 'loading'
								: commerceEnabled
									? 'default'
									: 'disabled'}
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
