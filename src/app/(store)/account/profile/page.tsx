import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {type AccountMe} from '../../../api/account/_lib/accountMeTypes'

async function getProfile(): Promise<AccountMe | null> {
	const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
	const cookieHeader = (await cookies())
		.getAll()
		.map(cookie => `${cookie.name}=${cookie.value}`)
		.join('; ')
	const res = await fetch(`${origin}/api/account/me`, {
		headers: cookieHeader
			? {cookie: cookieHeader}
			: undefined,
		cache: 'no-store',
	})
	if (!res.ok) {
		return null
	}

	const data = await res.json().catch(() => ({})) as {
		account?: AccountMe,
	}
	return data.account?.authenticated
		? data.account
		: null
}

type Order = {
	id: string,
	display_id?: number,
	total?: number,
}

async function getOrders(): Promise<Order[]> {
	const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
	const cookieHeader = (await cookies())
		.getAll()
		.map(cookie => `${cookie.name}=${cookie.value}`)
		.join('; ')
	const res = await fetch(`${origin}/api/account/orders`, {
		headers: cookieHeader
			? {cookie: cookieHeader}
			: undefined,
		cache: 'no-store',
	})
	if (!res.ok) {
		return []
	}

	const data = await res.json().catch(() => ({})) as {orders?: Order[]}
	return data.orders ?? []
}

export default async function AccountProfilePage() {
	const profile = await getProfile()
	if (!profile) {
		redirect('/account/login')
	}
	const orders = await getOrders()

	return (
		<div className="container mx-auto px-4 py-10 lg:py-14">
			<h1 className="text-3xl font-semibold">{'Профиль'}</h1>
			<div className="mt-6 space-y-2 text-muted-foreground">
				<p>{'Роль: покупатель'}</p>
				<p>{`Email: ${profile.email ?? 'не указан'}`}</p>
			</div>
			<div className="mt-8">
				<h2 className="text-xl font-semibold">{'История заказов'}</h2>
				{orders.length === 0 && <p className="mt-2 text-muted-foreground">{'Заказов пока нет.'}</p>}
				{orders.length > 0 && (
					<div className="mt-3 space-y-2">
						{orders.map(order => (
							<div
								key={order.id}
								className="rounded-md border p-3 text-sm"
							>
								<p>{`Заказ #${order.display_id ?? order.id}`}</p>
								<p className="text-muted-foreground">{`Сумма: ${((order.total ?? 0) / 100).toFixed(2)} ₽`}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
