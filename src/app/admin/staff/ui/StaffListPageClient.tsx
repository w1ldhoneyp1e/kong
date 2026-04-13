'use client'

import {Trash2} from 'lucide-react'
import {useState} from 'react'
import {type ListStaffResult, type StaffUser} from '../../../../entities/staff'
import {
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
} from '../../../../shared'
import {useStaffSession} from '../../StaffSessionContext'
import {useStaffListVm} from '../viewmodel/useStaffListVm'
import {formatStaffFullName} from '../viewmodel/utils/staffRoleLabels'
import {CreateStaffPopup} from './CreateStaffPopup'
import {StaffListRoleCell} from './StaffListRoleCell'

function StaffListPageClient({
	initialList,
}: Readonly<{initialList?: ListStaffResult}>) {
	const vm = useStaffListVm(initialList)
	const confirmDeleteId = vm.deleteConfirmId
	const [createOpen, setCreateOpen] = useState(false)
	const {role: viewerRoleCode} = useStaffSession()
	const viewerIsAdmin = (viewerRoleCode ?? '').toLowerCase() === 'admin'
	const pendingId = vm.updateRoleMutation.isPending
		? vm.updateRoleMutation.variables?.id
		: undefined

	console.log('viewerRoleCode', viewerRoleCode)


	return (
		<div>
			<CreateStaffPopup
				open={createOpen}
				onOpenChange={setCreateOpen}
			/>
			<EntityPageHeader
				title="Работники"
				actions={(
					<Button
						type="button"
						onClick={() => {
							setCreateOpen(true)
						}}
					>
						{'Добавить пользователя'}
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
			<DataTable<StaffUser>
				className="mb-6"
				columns={[
					{
						id: 'email',
						header: 'Email',
						cell: row => row.email ?? '—',
					},
					{
						id: 'fio',
						header: 'ФИО',
						cell: row => formatStaffFullName(row),
					},
					{
						id: 'role',
						header: 'Роль',
						cell: row => (
							<StaffListRoleCell
								row={row}
								viewerRoleCode={viewerRoleCode}
								isPending={vm.updateRoleMutation.isPending}
								pendingUserId={pendingId}
								onRoleChange={(id, roleCode) => {
									vm.updateRoleMutation.mutate({
										id,
										payload: {roleCode},
									})
								}}
							/>
						),
					},
				]}
				data={vm.users}
				getRowKey={row => row.id}
				loading={vm.loading}
				actions={row => {
					const rowLower = (row.roleCode ?? '').toLowerCase()
					const isRowOwner = rowLower === 'owner'
					const isRowAdmin = rowLower === 'admin'
					const deleteDisabled = isRowOwner
						|| (viewerIsAdmin && isRowAdmin)
					const deleteTitle = isRowOwner
						? 'Владельца нельзя удалить'
						: viewerIsAdmin && isRowAdmin
							? 'Удалить админа может только владелец'
							: 'Удалить'

					return (
						<div className="relative z-10 flex justify-end gap-1">
							<Button
								type="button"
								size="icon"
								variant="ghost"
								className="size-9 rounded-md hover:bg-background focus-visible:bg-background"
								disabled={deleteDisabled}
								title={deleteTitle}
								aria-label="Удалить пользователя"
								onClick={event => {
									event.stopPropagation()
									if (!deleteDisabled) {
										vm.setDeleteConfirmId(row.id)
									}
								}}
							>
								<Trash2
									className={
										deleteDisabled
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
