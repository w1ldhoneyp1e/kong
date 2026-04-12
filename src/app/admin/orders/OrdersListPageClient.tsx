'use client'

import {Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {type AdminOrder, type ListOrdersResult} from '../../../entities/order'
import {
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	StatusBadge,
} from '../../../shared'
import {formatOrderListTotal} from './formatOrderMoney'
import {getOrderStatusLabel, ORDER_STATUS_OPTIONS} from './orderStatus'
import {useOrdersListStore} from './viewmodel/ordersListStore'
import {useOrdersListVm} from './viewmodel/useOrdersListVm'

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

function OrdersListPageClient({
	initialList,
}: Readonly<{initialList?: ListOrdersResult}>) {
	const router = useRouter()
	const vm = useOrdersListVm(initialList)
	const confirmDeleteId = vm.deleteConfirmId

	const statusFilter = useOrdersListStore(s => s.statusFilter)
	const setStatusFilter = useOrdersListStore(s => s.setStatusFilter)
	const q = useOrdersListStore(s => s.q)
	const setQ = useOrdersListStore(s => s.setQ)
	const page = useOrdersListStore(s => s.page)
	const setPage = useOrdersListStore(s => s.setPage)
	const pageSize = useOrdersListStore(s => s.pageSize)

	const [qDraft, setQDraft] = useState(q)

	useEffect(() => {
		setQDraft(q)
	}, [q])

	return (
		<div>
			<EntityPageHeader title="Заказы" />
			<p className="mb-6 text-muted-foreground">
				{'Список заказов'}
			</p>
			<div className="mb-6 flex flex-wrap items-end gap-4">
				<div className="flex min-w-[200px] flex-col gap-2">
					<span className="text-sm font-medium">
						{'Статус'}
					</span>
					<Select
						value={statusFilter}
						onValueChange={setStatusFilter}
					>
						<SelectTrigger>
							<SelectValue placeholder="Статус" />
						</SelectTrigger>
						<SelectContent>
							{ORDER_STATUS_OPTIONS.map(o => (
								<SelectItem
									key={o.value}
									value={o.value}
								>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex min-w-[240px] flex-1 flex-col gap-2">
					<span className="text-sm font-medium">
						{'Поиск'}
					</span>
					<div className="flex gap-2">
						<Input
							value={qDraft}
							onChange={e => {
								setQDraft(e.target.value)
							}}
							placeholder="Email или номер заказа"
						/>
						<Button
							type="button"
							variant="secondary"
							onClick={() => {
								setQ(qDraft)
							}}
						>
							{'Найти'}
						</Button>
					</div>
				</div>
			</div>
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
			<DataTable<AdminOrder>
				className="mb-6"
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
						id: 'email',
						header: 'Покупатель',
						cell: row => row.email ?? '—',
					},
					{
						id: 'total',
						header: 'Сумма',
						align: 'right',
						cell: row => formatOrderListTotal(row),
					},
					{
						id: 'created',
						header: 'Создан',
						cell: row => formatCreatedAt(row.created_at ?? null),
					},
				]}
				data={vm.orders}
				getRowKey={row => row.id}
				loading={vm.loading}
				onRowClick={row => {
					router.push(`/admin/orders/${row.id}`)
				}}
				pagination={{
					page,
					pageSize,
					total: vm.totalCount,
					onPageChange: setPage,
				}}
				actions={row => (
					<div className="relative z-10 flex justify-end gap-1">
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
							aria-label="Удалить заказ"
							onClick={event => {
								event.stopPropagation()
								vm.setDeleteConfirmId(row.id)
							}}
						>
							<Trash2 className="size-5 text-destructive" />
						</Button>
					</div>
				)}
			/>
			<ConfirmDialog
				open={confirmDeleteId !== null}
				onOpenChange={open => {
					if (!open) {
						vm.setDeleteConfirmId(null)
					}
				}}
				title="Удалить заказ?"
				description="Действие необратимо. Заказ будет удалён из системы."
				confirmLabel="Удалить"
				onConfirm={() => {
					if (confirmDeleteId) {
						vm.deleteMutation.mutate(confirmDeleteId, {
							onSettled: () => {
								vm.setDeleteConfirmId(null)
							},
						})
					}
				}}
			/>
		</div>
	)
}

export {OrdersListPageClient}
