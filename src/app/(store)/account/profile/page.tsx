import {redirect} from 'next/navigation'
import {getBackendUrl} from '../../../../shared'
import {type AccountMe} from '../../../api/account/_lib/accountMeTypes'

const CUSTOMER_TOKEN_COOKIE = 'kong_customer_token'

async function getProfile(): Promise<AccountMe | null> {
	const {cookies} = await import('next/headers')
	const cookieStore = await cookies()
	const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value
	if (!token) {
		return null
	}

	const res = await fetch(`${getBackendUrl()}/customer/me`, {
		headers: {Authorization: `Bearer ${token}`},
		cache: 'no-store',
	})
	if (!res.ok) {
		return null
	}

	const data = await res.json().catch(() => ({})) as {
		customer?: {email?: string | null},
	}

	return {
		authenticated: true,
		actorType: 'customer',
		roleCode: 'customer',
		email: data.customer?.email ?? null,
	}
}

type Order = {
	id: string,
	display_id?: number,
	total?: number,
}

async function getOrders(): Promise<Order[]> {
	const {cookies} = await import('next/headers')
	const cookieStore = await cookies()
	const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value
	if (!token) {
		return []
	}

	const key = process.env.MEDUSA_PUBLISHABLE_KEY
		?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
	const headers: Record<string, string> = {Authorization: `Bearer ${token}`}
	if (key) {
		headers['x-publishable-api-key'] = key
	}

	const res = await fetch(`${getBackendUrl()}/store/orders`, {
		headers,
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
