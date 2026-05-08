type StaffRoleCode = 'owner' | 'admin' | 'manager'

type StaffUser = {
	id: string,
	email: string,
	first_name: string | null,
	last_name: string | null,
	roleCode: StaffRoleCode,
	passwordHash: string,
	created_at: string,
}

type StaffSession = {
	token: string,
	userId: string,
	created_at: string,
	expires_at: string,
}

type StaffMeResponse = {
	staff: {
		id: string,
		email: string,
		roleCode: StaffRoleCode,
	},
	permissions: string[],
}

type ListStaffUsersResponse = {
	users: Array<Omit<StaffUser, 'passwordHash'>>,
	count: number,
}

export type {
	ListStaffUsersResponse,
	StaffMeResponse,
	StaffRoleCode,
	StaffSession,
	StaffUser,
}
