type StaffUser = {
	id: string,
	email?: string | null,
	first_name?: string | null,
	last_name?: string | null,
	roleCode?: string | null,
	created_at?: string | null,
}

type CreateStaffPayload = {
	email: string,
	password: string,
	first_name?: string | null,
	last_name?: string | null,
	roleCode?: 'admin' | 'manager',
}

type UpdateStaffRolePayload = {
	roleCode: string,
}

type ListStaffResult = {
	users: StaffUser[],
	count?: number,
}

export type {
	CreateStaffPayload,
	ListStaffResult,
	StaffUser,
	UpdateStaffRolePayload,
}
