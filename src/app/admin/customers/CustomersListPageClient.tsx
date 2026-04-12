'use client'

import {Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {type AdminCustomer, type ListCustomersResult} from '../../../entities/customer'
import {
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	Input,
} from '../../../shared'
import {CreateCustomerPopup} from './CreateCustomerPopup'
import {useCustomersListStore} from './viewmodel/customersListStore'
import {useCustomersListVm} from './viewmodel/useCustomersListVm'

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

function displayName(row: AdminCustomer): string {
	const parts = [row.first_name, row.last_name].filter(Boolean)

	return parts.length > 0
		? parts.join(' ')
		: '—'
}

function CustomersListPageClient({
	initialList,
}: Readonly<{initialList?: ListCustomersResult}>) {
	const router = useRouter()
	const vm = useCustomersListVm(initialList)
	const confirmDeleteId = vm.deleteConfirmId

	const q = useCustomersListStore(s => s.q)
	const setQ = useCustomersListStore(s => s.setQ)
	const page = useCustomersListStore(s => s.page)
	const setPage = useCustomersListStore(s => s.setPage)
	const pageSize = useCustomersListStore(s => s.pageSize)

	const [qDraft, setQDraft] = useState(q)
	const [createOpen, setCreateOpen] = useState(false)

	useEffect(() => {
		setQDraft(q)
	}, [q])

	return (
		<div>
			<CreateCustomerPopup
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
			<EntityPageHeader
				title="Покупатели"
				actions={(
					<Button
						type="button"
						onClick={() => {
							setCreateOpen(true)
						}}
					>
						{'Создать покупателя'}
					</Button>
				)}
			/>
			<p className="mb-6 text-muted-foreground">
				{'Список зарегистрированных покупателей'}
			</p>
			<div className="mb-6 flex flex-wrap items-end gap-4">
				<div className="flex min-w-[280px] flex-1 flex-col gap-2">
					<span className="text-sm font-medium">
						{'Поиск'}
					</span>
					<div className="flex gap-2">
						<Input
							className="w-[300px]"
							value={qDraft}
							onChange={e => {
								setQDraft(e.target.value)
							}}
							placeholder="Email или имя"
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
			<DataTable<AdminCustomer>
				className="mb-6"
				columns={[
					{
						id: 'email',
						header: 'Email',
						cell: row => row.email ?? '—',
					},
					{
						id: 'name',
						header: 'Имя',
						cell: row => displayName(row),
					},
					{
						id: 'created',
						header: 'Регистрация',
						cell: row => formatCreatedAt(row.created_at ?? null),
					},
				]}
				data={vm.customers}
				getRowKey={row => row.id}
				loading={vm.loading}
				onRowClick={row => {
					router.push(`/admin/customers/${row.id}`)
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
							aria-label="Удалить покупателя"
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
				title="Удалить покупателя?"
				description="Будут удалены данные покупателя. Действие необратимо."
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

export {CustomersListPageClient}
