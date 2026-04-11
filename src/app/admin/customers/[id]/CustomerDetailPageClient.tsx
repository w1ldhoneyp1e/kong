'use client'

import {useRouter} from 'next/navigation'
import {type AdminCustomer} from '../../../../entities/customer'
import {type AdminOrder} from '../../../../entities/order'
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	FormField,
	Input,
	Link,
	StatusBadge,
} from '../../../../shared'
import {formatOrderListTotal} from '../../orders/formatOrderMoney'
import {getOrderStatusLabel} from '../../orders/orderStatus'
import {useCustomerDetailVm} from '../viewmodel/useCustomerDetailVm'

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

function CustomerDetailPageClient({
	id,
	initialCustomer,
}: Readonly<{
	id: string,
	initialCustomer?: AdminCustomer,
}>) {
	const router = useRouter()
	const vm = useCustomerDetailVm(id, initialCustomer)

	if (vm.loading && !vm.customer) {
		return (
			<p className="text-muted-foreground">
				{'Загрузка…'}
			</p>
		)
	}

	if (!vm.customer) {
		return (
			<p className="text-destructive">
				{'Покупатель не найден'}
			</p>
		)
	}

	const c = vm.customer

	return (
		<div>
			<EntityPageHeader
				title={c.email ?? 'Покупатель'}
				backHref="/admin/customers"
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
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Данные покупателя'}
					</CardTitle>
				</CardHeader>
				<CardContent className="max-w-lg space-y-4">
					<FormField label="Email">
						<Input
							value={vm.emailDraft}
							onChange={e => {
								vm.setEmailDraft(e.target.value)
							}}
							type="email"
							autoComplete="off"
						/>
					</FormField>
					<FormField label="Имя">
						<Input
							value={vm.firstNameDraft}
							onChange={e => {
								vm.setFirstNameDraft(e.target.value)
							}}
							autoComplete="off"
						/>
					</FormField>
					<FormField label="Фамилия">
						<Input
							value={vm.lastNameDraft}
							onChange={e => {
								vm.setLastNameDraft(e.target.value)
							}}
							autoComplete="off"
						/>
					</FormField>
					<Button
						type="button"
						disabled={vm.updateMutation.isPending}
						onClick={() => {
							vm.updateMutation.mutate({
								id,
								payload: {
									email: vm.emailDraft || null,
									first_name: vm.firstNameDraft || null,
									last_name: vm.lastNameDraft || null,
								},
							})
						}}
					>
						{'Сохранить'}
					</Button>
				</CardContent>
			</Card>
			<Card className="mb-6">
				<CardHeader>
					<CardTitle>
						{'Заказы этого покупателя'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<DataTable<AdminOrder>
						columns={[
							{
								id: 'display_id',
								header: 'Номер',
								cell: row => (
									row.display_id === undefined || row.display_id === null
										? '—'
										: String(row.display_id)
								),
							},
							{
								id: 'status',
								header: 'Статус',
								cell: row => (
									<StatusBadge
										status={row.status ?? '—'}
										label={getOrderStatusLabel(row.status)}
									/>
								),
							},
							{
								id: 'total',
								header: 'Сумма',
								align: 'right',
								cell: row => formatOrderListTotal(row),
							},
							{
								id: 'created',
								header: 'Дата',
								cell: row => formatCreatedAt(row.created_at ?? null),
							},
							{
								id: 'open',
								header: '',
								className: 'w-24',
								cell: row => (
									<Link
										href={`/admin/orders/${row.id}`}
										className="text-primary underline"
										onClick={e => {
											e.stopPropagation()
										}}
									>
										{'Открыть'}
									</Link>
								),
							},
						]}
						data={vm.orders}
						getRowKey={row => row.id}
						loading={vm.ordersLoading}
						emptyLabel={
							vm.ordersLoading
								? 'Загрузка…'
								: 'Нет заказов'
						}
						onRowClick={row => {
							router.push(`/admin/orders/${row.id}`)
						}}
					/>
				</CardContent>
			</Card>
			<ConfirmDialog
				open={vm.deleteConfirmOpen}
				onOpenChange={vm.setDeleteConfirmOpen}
				title="Удалить покупателя?"
				description="Данные покупателя будут удалены без возможности восстановления."
				confirmLabel="Удалить"
				onConfirm={() => {
					vm.deleteMutation.mutate(id, {
						onSuccess: () => {
							vm.setDeleteConfirmOpen(false)
							router.push('/admin/customers')
						},
					})
				}}
			/>
		</div>
	)
}

export {CustomerDetailPageClient}
