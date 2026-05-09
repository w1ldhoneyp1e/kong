'use client'

import {useRouter} from 'next/navigation'
import {type AdminOrder, type AdminOrderItem} from '../../../../entities/order'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	EntityPageHeader,
	Link,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	StatusBadge,
} from '../../../../shared'
import {formatOrderListTotal} from '../formatOrderMoney'
import {getOrderStatusLabel, ORDER_STATUS_EDIT_OPTIONS} from '../orderStatus'
import {useOrderDetailVm} from '../viewmodel/useOrderDetailVm'

function formatCreatedAt(value: string | null | undefined): string {
	if (!value) {
		return '—'
	}

	const d = new Date(value)

	if (Number.isNaN(d.getTime())) {
		return value
	}

	return d.toLocaleString('ru-RU')
}

function lineTitle(row: AdminOrderItem): string {
	return row.item?.title ?? row.title ?? row.product_title ?? '—'
}

function lineUnitPrice(row: AdminOrderItem): string {
	const up = row.item?.unit_price ?? row.unit_price
	if (up === undefined || up === null) {
		return '—'
	}

	if (typeof up === 'number') {
		return String(up)
	}

	if (
		typeof up === 'object'
		&& 'amount' in up
		&& up.amount !== undefined
		&& up.amount !== null
	) {
		return String(up.amount)
	}

	return '—'
}

function customerName(order: AdminOrder): string | null {
	const shippingName = [
		order.shipping_address?.first_name,
		order.shipping_address?.last_name,
	]
		.filter(Boolean)
		.join(' ')

	if (shippingName) {
		return shippingName
	}

	const metadataName = order.metadata?.customer_name
	return typeof metadataName === 'string' && metadataName.trim()
		? metadataName
		: null
}

function OrderDetailPageClient({
	id,
	initialOrder,
}: Readonly<{
	id: string,
	initialOrder?: AdminOrder,
}>) {
	const router = useRouter()
	const vm = useOrderDetailVm(id, initialOrder)

	if (vm.loading && !vm.order) {
		return (
			<p className="text-muted-foreground">
				{'Загрузка…'}
			</p>
		)
	}

	if (!vm.order) {
		return (
			<p className="text-destructive">
				{'Заказ не найден'}
			</p>
		)
	}

	const o = vm.order

	return (
		<div>
			<EntityPageHeader
				title={
					o.display_id === undefined || o.display_id === null
						? 'Заказ'
						: `Заказ #${String(o.display_id)}`
				}
				backHref="/admin/orders"
				actions={(
					<Button
						type="button"
						variant="destructive"
						onClick={() => {
							vm.setDeleteConfirmOpen(true)
						}}
					>
						{'Удалить'}
					</Button>
				)}
			/>
			{vm.error && !vm.loading
				? (
					<p
						className="mb-4 text-sm text-destructive"
						role="alert"
					>
						{vm.error}
					</p>
				)
				: null}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<StatusBadge
					status={o.status ?? '—'}
					label={getOrderStatusLabel(o.status)}
				/>
				<span className="text-sm text-muted-foreground">
					{formatCreatedAt(o.created_at ?? null)}
				</span>
				<span className="text-sm font-medium">
					{formatOrderListTotal(o)}
				</span>
			</div>
			<div className="mb-6 flex flex-wrap items-end gap-4">
				<div className="flex min-w-[220px] flex-col gap-2">
					<span className="text-sm font-medium">
						{'Статус заказа'}
					</span>
					<div className="flex flex-wrap items-center gap-2">
						<Select
							value={vm.statusDraft}
							onValueChange={vm.setStatusDraft}
						>
							<SelectTrigger>
								<SelectValue placeholder="Статус" />
							</SelectTrigger>
							<SelectContent>
								{ORDER_STATUS_EDIT_OPTIONS.map(opt => (
									<SelectItem
										key={opt.value}
										value={opt.value}
									>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							type="button"
							disabled={vm.updateMutation.isPending}
							onClick={() => {
								vm.updateMutation.mutate({
									id,
									payload: {status: vm.statusDraft},
								})
							}}
						>
							{'Сохранить'}
						</Button>
					</div>
				</div>
			</div>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Покупатель'}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm">
					<p>
						<span className="text-muted-foreground">
							{'Имя: '}
						</span>
						{customerName(o) ?? '—'}
					</p>
					<p>
						<span className="text-muted-foreground">
							{'Email: '}
						</span>
						{o.email ?? '—'}
					</p>
					<p>
						<span className="text-muted-foreground">
							{'Телефон: '}
						</span>
						{o.shipping_address?.phone ?? '—'}
					</p>
					{o.customer_id
						? (
							<p>
								<Link
									href={`/admin/customers/${o.customer_id}`}
									className="text-primary underline"
								>
									{'Открыть карточку покупателя'}
								</Link>
							</p>
						)
						: null}
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Товары'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b text-left">
									<th className="py-2 pr-4 font-medium">
										{'Название'}
									</th>
									<th className="py-2 pr-4 font-medium">
										{'Кол-во'}
									</th>
									<th className="py-2 font-medium">
										{'Цена'}
									</th>
								</tr>
							</thead>
							<tbody>
								{(o.items ?? []).map(row => (
									<tr
										key={row.id}
										className="border-b border-border/60"
									>
										<td className="py-2 pr-4">
											{lineTitle(row)}
										</td>
										<td className="py-2 pr-4">
											{row.quantity === undefined || row.quantity === null
												? '—'
												: String(row.quantity)}
										</td>
										<td className="py-2">
											{lineUnitPrice(row)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Доставка'}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-sm">
					{o.shipping_address
						? (
							<div className="space-y-1">
								<p>
									{[
										o.shipping_address.first_name,
										o.shipping_address.last_name,
									]
										.filter(Boolean)
										.join(' ')
										|| '—'}
								</p>
								<p>
									{[
										o.shipping_address.address_1,
										o.shipping_address.city,
										o.shipping_address.postal_code,
										o.shipping_address.country_code,
									]
										.filter(Boolean)
										.join(', ')}
								</p>
								{o.shipping_address.phone
									? (
										<p className="text-muted-foreground">
											{`Телефон: ${o.shipping_address.phone}`}
										</p>
									)
									: null}
							</div>
						)
						: (
							<p className="text-muted-foreground">
								{'Нет адреса доставки'}
							</p>
						)}
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Оплата'}
					</CardTitle>
				</CardHeader>
				<CardContent className="text-sm">
					{(o.transactions ?? []).length > 0
						? (
							<ul className="list-inside list-disc space-y-1">
								{(o.transactions ?? []).map((t, idx) => (
									<li key={t.id ?? `tx-${idx}`}>
										{typeof t.amount === 'number'
											? String(t.amount)
											: JSON.stringify(t.amount)}
										{' '}
										{t.currency_code ?? o.currency_code ?? ''}
									</li>
								))}
							</ul>
						)
						: (
							<p className="text-muted-foreground">
								{'Нет транзакций'}
							</p>
						)}
				</CardContent>
			</Card>
			<ConfirmDialog
				open={vm.deleteConfirmOpen}
				onOpenChange={vm.setDeleteConfirmOpen}
				title="Удалить заказ?"
				description="Действие необратимо."
				confirmLabel="Удалить"
				onConfirm={() => {
					vm.deleteMutation.mutate(id, {
						onSuccess: () => {
							vm.setDeleteConfirmOpen(false)
							router.push('/admin/orders')
						},
					})
				}}
			/>
		</div>
	)
}

export {OrderDetailPageClient}
