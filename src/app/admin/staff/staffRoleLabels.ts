function formatStaffFullName(row: {
	first_name?: string | null,
	last_name?: string | null,
}): string {
	const parts = [row.first_name, row.last_name].filter(Boolean)

	return parts.length > 0
		? parts.join(' ')
		: '—'
}

function getStaffRoleLabel(roleCode: string | null | undefined): string {
	const k = (roleCode ?? '').toLowerCase()
	if (k === 'owner') {
		return 'Владелец'
	}

	if (k === 'admin') {
		return 'Админ'
	}

	if (k === 'manager') {
		return 'Менеджер'
	}

	return roleCode ?? '—'
}

export {
	formatStaffFullName,
	getStaffRoleLabel,
}
