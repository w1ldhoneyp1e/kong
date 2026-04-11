'use client'

import {useRouter} from 'next/navigation'
import {type StaffUser} from '../../../../entities/staff'
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	ConfirmDialog,
	EntityPageHeader,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../shared'
import {useStaffSession} from '../../StaffSessionContext'
import {getStaffRoleLabel} from '../staffRoleLabels'
import {useStaffDetailVm} from '../viewmodel/useStaffDetailVm'

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

function StaffDetailPageClient({
	id,
	initialUser,
}: Readonly<{
	id: string,
	initialUser?: StaffUser,
}>) {
	const router = useRouter()
	const vm = useStaffDetailVm(id, initialUser)
	const {permissions} = useStaffSession()
	const canAssignAdmin = permissions.includes('roles:manage')

	if (vm.loading && !vm.user) {
		return (
			<p className="text-muted-foreground">
				{'Загрузка…'}
			</p>
		)
	}

	if (!vm.user) {
		return (
			<p className="text-destructive">
				{'Пользователь не найден'}
			</p>
		)
	}

	const u = vm.user
	const roleLower = (u.roleCode ?? '').toLowerCase()
	const isOwner = roleLower === 'owner'
	const isAdmin = roleLower === 'admin'
	const roleEditable = !isOwner && (canAssignAdmin || !isAdmin)

	return (
		<div>
			<EntityPageHeader
				title={u.email ?? 'Пользователь'}
				backHref="/admin/staff"
				actions={(
					<Button
						type="button"
						variant="destructive"
						disabled={isOwner}
						title={isOwner
							? 'Владельца нельзя удалить'
							: undefined}
						onClick={() => {
							if (!isOwner) {
								vm.setDeleteConfirmOpen(true)
							}
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
				<Badge variant={staffRoleVariant(u.roleCode)}>
					{getStaffRoleLabel(u.roleCode)}
				</Badge>
				<span className="text-sm text-muted-foreground">
					{`Создан: ${formatCreatedAt(u.created_at ?? null)}`}
				</span>
			</div>
			<Card className="mb-6 max-w-md">
				<CardHeader>
					<CardTitle>
						{'Роль'}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{isOwner
						? (
							<p className="text-sm text-muted-foreground">
								{'Роль владельца нельзя изменить через интерфейс.'}
							</p>
						)
						: !roleEditable
							? (
								<p className="text-sm text-muted-foreground">
									{'Недостаточно прав для смены роли этого пользователя.'}
								</p>
							)
							: (
								<div className="flex flex-wrap items-center gap-2">
									<Select
										value={vm.roleDraft}
										onValueChange={vm.setRoleDraft}
									>
										<SelectTrigger className="w-[220px]">
											<SelectValue placeholder="Роль" />
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
									<Button
										type="button"
										disabled={
											vm.updateRoleMutation.isPending
											|| vm.roleDraft === (u.roleCode ?? '')
										}
										onClick={() => {
											vm.updateRoleMutation.mutate({
												id,
												payload: {roleCode: vm.roleDraft},
											})
										}}
									>
										{'Сохранить роль'}
									</Button>
								</div>
							)}
				</CardContent>
			</Card>
			<ConfirmDialog
				open={vm.deleteConfirmOpen}
				onOpenChange={vm.setDeleteConfirmOpen}
				title="Удалить пользователя?"
				description="Учётная запись будет удалена без возможности восстановления."
				confirmLabel="Удалить"
				onConfirm={() => {
					vm.deleteMutation.mutate(id, {
						onSuccess: () => {
							vm.setDeleteConfirmOpen(false)
							router.push('/admin/staff')
						},
					})
				}}
			/>
		</div>
	)
}

export {StaffDetailPageClient}
