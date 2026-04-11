export {adminCustomerApi} from './api'
export {
	adminCustomerDetailIdleKey,
	adminCustomerOrdersQueryKey,
	adminCustomersListIdleKey,
	adminCustomersListQueryKey,
	adminCustomerQueryKey,
	useCreateCustomerMutation,
	useCustomerOrdersQuery,
	useCustomerQuery,
	useCustomersQuery,
	useDeleteCustomerMutation,
	useUpdateCustomerMutation,
} from './queries'
export type {
	UseCustomerQueryOptions,
	UseCustomersQueryOptions,
} from './queries'
export type {
	AdminCustomer,
	CreateCustomerPayload,
	ListCustomersQuery,
	ListCustomersResult,
	UpdateCustomerPayload,
} from './types'
