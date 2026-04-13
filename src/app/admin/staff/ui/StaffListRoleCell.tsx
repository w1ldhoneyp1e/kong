import {type StaffUser} from '../../../../entities/staff'
import {
	Badge,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../../../shared'
import {getStaffRoleLabel} from '../viewmodel/utils/staffRoleLabels'

type StaffListRoleCellProps = {
	row: StaffUser,
	viewerRoleCode: string | null,
	isPending: boolean,
	pendingUserId: string | undefined,
	onRoleChange: (id: string, roleCode: string) => void,
}

function StaffListRoleCell({
	row,
	viewerRoleCode,
	isPending,
	pendingUserId,
	onRoleChange,
}: Readonly<StaffListRoleCellProps>) {
	const rowLower = (row.roleCode ?? '').toLowerCase()
	const rowIsOwner = rowLower === 'owner'
	const viewerLower = (viewerRoleCode ?? '').toLowerCase()
	const viewerIsOwner = viewerLower === 'owner'
	const viewerIsAdmin = viewerLower === 'admin'
	const saving = isPending && pendingUserId === row.id

	if (rowIsOwner && viewerIsOwner) {
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
					value="owner"
					disabled={true}
				>
					<SelectTrigger className="h-8 w-[160px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="owner">
							{getStaffRoleLabel('owner')}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		)
	}

	if (viewerIsOwner && (rowLower === 'admin' || rowLower === 'manager')) {
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
						<SelectItem value="admin">
							{getStaffRoleLabel('admin')}
						</SelectItem>
						<SelectItem value="manager">
							{getStaffRoleLabel('manager')}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		)
	}

	if (viewerIsAdmin) {
		return (
			<Badge variant={staffRoleVariant(row.roleCode)}>
				{getStaffRoleLabel(row.roleCode)}
			</Badge>
		)
	}

	return (
		<Badge variant={staffRoleVariant(row.roleCode)}>
			{getStaffRoleLabel(row.roleCode)}
		</Badge>
	)
}

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

export {StaffListRoleCell}
