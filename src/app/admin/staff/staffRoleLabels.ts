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

export {getStaffRoleLabel}
