type StaffUser = {
	id: string,
	email?: string | null,
	roleCode?: string | null,
	created_at?: string | null,
}

type CreateStaffPayload = {
	email: string,
	password: string,
	roleCode?: 'admin' | 'manager',
}

type UpdateStaffRolePayload = {
	roleCode: string,
}

type ListStaffResult = {
	users: StaffUser[],
}

export type {
	CreateStaffPayload,
	ListStaffResult,
	StaffUser,
	UpdateStaffRolePayload,
}
