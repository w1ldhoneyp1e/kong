'use client'

import {useState} from 'react'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../../../shared'

type StoreSettings = {
	id: string,
	name: string,
	commerce_enabled: boolean,
}

type StoreSettingsPageClientProps = {
	initialStore: StoreSettings | null,
}

function StoreSettingsPageClient({
	initialStore,
}: StoreSettingsPageClientProps) {
	const [store, setStore] = useState<StoreSettings | null>(initialStore)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	const commerceEnabled = store?.commerce_enabled ?? true

	const saveCommerceState = async (nextValue: boolean) => {
		setLoading(true)
		setMessage('')
		setError('')

		try {
			const res = await fetch('/api/store', {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				credentials: 'same-origin',
				body: JSON.stringify({
					commerce_enabled: nextValue,
				}),
			})
			const data = await res.json().catch(() => ({})) as {
				store?: StoreSettings,
				error?: string,
				message?: string,
			}

			if (!res.ok) {
				throw new Error(data.error ?? data.message ?? `HTTP ${res.status}`)
			}

			if (data.store) {
				setStore(data.store)
			}

			setMessage(nextValue
				? 'Цены и оформление заказа включены'
				: 'Цены и оформление заказа скрыты')
		}
		catch (cause) {
			setError(cause instanceof Error
				? cause.message
				: 'Не удалось сохранить настройки магазина')
		}
		finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="heading-4">{'Настройки магазина'}</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{'Пока здесь только один бизнес-переключатель, который управляет ценами и возможностью покупки.'}
				</p>
			</div>

			{error
				? (
					<div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)
				: null}
			{message
				? (
					<div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
						{message}
					</div>
				)
				: null}

			<Card className="max-w-2xl">
				<CardHeader>
					<CardTitle>{'Продажи на витрине'}</CardTitle>
					<CardDescription>
						{'Если выключить этот режим, покупатели не увидят цены и не смогут добавить товар в корзину или оформить заказ.'}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-1">
						<div className="text-sm font-medium">
							{commerceEnabled
								? 'Покупка включена'
								: 'Покупка выключена'}
						</div>
						<div className="text-sm text-muted-foreground">
							{commerceEnabled
								? 'Показываем цены, корзину и checkout.'
								: 'Скрываем цены и блокируем покупку на витрине.'}
						</div>
					</div>

					<Button
						type="button"
						variant={commerceEnabled
							? 'outline'
							: 'default'}
						state={loading
							? 'loading'
							: 'default'}
						onClick={() => {
							saveCommerceState(!commerceEnabled).catch(() => undefined)
						}}
					>
						{commerceEnabled
							? 'Выключить покупку'
							: 'Включить покупку'}
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

export {StoreSettingsPageClient}
