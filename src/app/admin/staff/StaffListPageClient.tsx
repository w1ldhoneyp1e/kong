'use client'

import {Trash2} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {type ListStaffResult, type StaffUser} from '../../../entities/staff'
import {
	Badge,
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
} from '../../../shared'
import {getStaffRoleLabel} from './staffRoleLabels'
import {useStaffListVm} from './viewmodel/useStaffListVm'

function staffRoleVariant(
	roleCode: string | null | undefined,
): 'default' | 'destructive' | 'secondary' {
	const k = (roleCode ?? '').toLowerCase()
	if (k === 'owner') {
		return 'destructive'
	}

	if (k === 'admin') {
		return 'default'
	}

	return 'secondary'
}

function StaffListPageClient({
	initialList,
}: Readonly<{initialList?: ListStaffResult}>) {
	const router = useRouter()
	const vm = useStaffListVm(initialList)
	const confirmDeleteId = vm.deleteConfirmId

	return (
		<div>
			<EntityPageHeader
				title="Работники"
				actions={(
					<Button
						type="button"
						onClick={() => {
							router.push('/admin/staff/new')
						}}
					>
						{'Добавить пользователя'}
					</Button>
				)}
			/>
			<p className="mb-6 text-muted-foreground">
				{'Учётные записи staff (RBAC)'}
			</p>
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
			<DataTable<StaffUser>
				className="mb-6"
				columns={[
					{
						id: 'email',
						header: 'Email',
						cell: row => row.email ?? '—',
					},
					{
						id: 'role',
						header: 'Роль',
						cell: row => (
							<Badge variant={staffRoleVariant(row.roleCode)}>
								{getStaffRoleLabel(row.roleCode)}
							</Badge>
						),
					},
				]}
				data={vm.users}
				getRowKey={row => row.id}
				loading={vm.loading}
				onRowClick={row => {
					router.push(`/admin/staff/${encodeURIComponent(row.id)}`)
				}}
				actions={row => {
					const isOwner = (row.roleCode ?? '').toLowerCase() === 'owner'

					return (
						<div className="relative z-10 flex justify-end gap-1">
							<Button
								type="button"
								size="icon"
								variant="ghost"
								className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
								disabled={isOwner}
								title={isOwner
									? 'Владельца нельзя удалить'
									: 'Удалить'}
								aria-label="Удалить пользователя"
								onClick={event => {
									event.stopPropagation()
									if (!isOwner) {
										vm.setDeleteConfirmId(row.id)
									}
								}}
							>
								<Trash2
									className={
										isOwner
											? 'size-5 text-muted-foreground'
											: 'size-5 text-destructive'
									}
								/>
							</Button>
						</div>
					)
				}}
			/>
			<ConfirmDialog
				open={confirmDeleteId !== null}
				onOpenChange={open => {
					if (!open) {
						vm.setDeleteConfirmId(null)
					}
				}}
				title="Удалить пользователя?"
				description="Учётная запись будет удалена без возможности восстановления."
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

export {StaffListPageClient}
