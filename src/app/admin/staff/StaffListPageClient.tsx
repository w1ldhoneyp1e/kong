'use client'

import {Trash2} from 'lucide-react'
import {useState} from 'react'
import {type ListStaffResult, type StaffUser} from '../../../entities/staff'
import {
	Badge,
	Button,
	ConfirmDialog,
	DataTable,
	EntityPageHeader,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../shared'
import {useStaffSession} from '../StaffSessionContext'
import {CreateStaffPopup} from './CreateStaffPopup'
import {formatStaffFullName, getStaffRoleLabel} from './staffRoleLabels'
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

function StaffListRoleCell({
	row,
	canAssignAdmin,
	isPending,
	pendingUserId,
	onRoleChange,
}: Readonly<{
	row: StaffUser,
	canAssignAdmin: boolean,
	isPending: boolean,
	pendingUserId: string | undefined,
	onRoleChange: (id: string, roleCode: string) => void,
}>) {
	const roleLower = (row.roleCode ?? '').toLowerCase()
	const isOwner = roleLower === 'owner'
	const isAdmin = roleLower === 'admin'
	const canEdit = !isOwner && (canAssignAdmin || !isAdmin)
	const saving = isPending && pendingUserId === row.id

	if (isOwner || !canEdit) {
		return (
			<Badge variant={staffRoleVariant(row.roleCode)}>
				{getStaffRoleLabel(row.roleCode)}
			</Badge>
		)
	}

	const value = row.roleCode ?? 'manager'

	return (
		<div
			className="min-w-[160px]"
			onClick={e => {
				e.stopPropagation()
			}}
			onPointerDown={e => {
				e.stopPropagation()
			}}
		>
			<Select
				value={value}
				disabled={saving}
				onValueChange={v => {
					if (value === v) {
						return
					}

					onRoleChange(row.id, v)
				}}
			>
				<SelectTrigger className="h-8 w-[160px]">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{canAssignAdmin
						? (
							<>
								<SelectItem value="admin">
									{'Админ'}
								</SelectItem>
								<SelectItem value="manager">
									{'Менеджер'}
								</SelectItem>
							</>
						)
						: (
							<SelectItem value="manager">
								{'Менеджер'}
							</SelectItem>
						)}
				</SelectContent>
			</Select>
		</div>
	)
}

function StaffListPageClient({
	initialList,
}: Readonly<{initialList?: ListStaffResult}>) {
	const vm = useStaffListVm(initialList)
	const confirmDeleteId = vm.deleteConfirmId
	const [createOpen, setCreateOpen] = useState(false)
	const {permissions} = useStaffSession()
	const canAssignAdmin = permissions.includes('roles:manage')
	const pendingId = vm.updateRoleMutation.isPending
		? vm.updateRoleMutation.variables?.id
		: undefined

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
								canAssignAdmin={canAssignAdmin}
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
