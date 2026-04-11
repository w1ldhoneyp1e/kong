type AdminCustomer = {
	id: string,
	email?: string | null,
	first_name?: string | null,
	last_name?: string | null,
	created_at?: string | null,
	updated_at?: string | null,
	has_account?: boolean | null,
}

type ListCustomersQuery = {
	q?: string,
	limit?: number,
	offset?: number,
}

type ListCustomersResult = {
	customers: AdminCustomer[],
	count: number,
}

type CreateCustomerPayload = {
	email: string,
	first_name?: string | null,
	last_name?: string | null,
}

type UpdateCustomerPayload = {
	email?: string | null,
	first_name?: string | null,
	last_name?: string | null,
}

export type {
	AdminCustomer,
	CreateCustomerPayload,
	ListCustomersQuery,
	ListCustomersResult,
	UpdateCustomerPayload,
}
