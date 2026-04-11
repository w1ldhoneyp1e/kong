'use client'

import {useEffect, useState} from 'react'
import {
	type AdminCustomer,
	useCustomerOrdersQuery,
	useCustomerQuery,
	useDeleteCustomerMutation,
	useUpdateCustomerMutation,
} from '../../../../entities/customer'
import {useCustomerDetailStore} from './customerDetailStore'

function useCustomerDetailVm(
	id: string,
	initialCustomer?: AdminCustomer,
) {
	const {
		data: customer,
		isLoading,
		isFetching,
		error: queryError,
	} = useCustomerQuery(id, {
		initialData: initialCustomer,
	})

	const {
		data: ordersData,
		isLoading: ordersLoading,
		isFetching: ordersFetching,
		error: ordersQueryError,
	} = useCustomerOrdersQuery(id, {
		limit: 20,
		offset: 0,
	})

	const updateMutation = useUpdateCustomerMutation()
	const deleteMutation = useDeleteCustomerMutation()

	const deleteConfirmOpen = useCustomerDetailStore(s => s.deleteConfirmOpen)
	const setDeleteConfirmOpen = useCustomerDetailStore(s => s.setDeleteConfirmOpen)

	const [emailDraft, setEmailDraft] = useState(initialCustomer?.email ?? '')
	const [firstNameDraft, setFirstNameDraft] = useState(
		initialCustomer?.first_name ?? '',
	)
	const [lastNameDraft, setLastNameDraft] = useState(
		initialCustomer?.last_name ?? '',
	)

	useEffect(() => {
		if (!customer) {
			return
		}

		setEmailDraft(customer.email ?? '')
		setFirstNameDraft(customer.first_name ?? '')
		setLastNameDraft(customer.last_name ?? '')
	}, [customer])

	const loading = isLoading || isFetching
	const ordersLoadingState = ordersLoading || ordersFetching

	const errorMessage = (err: unknown): string => (err instanceof Error
		? err.message
		: String(err))

	const error
		= (queryError && errorMessage(queryError))
		?? (ordersQueryError && errorMessage(ordersQueryError))
		?? (updateMutation.error && errorMessage(updateMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	return {
		customer,
		orders: ordersData?.orders ?? [],
		ordersLoading: ordersLoadingState,
		loading,
		error,
		deleteConfirmOpen,
		setDeleteConfirmOpen,
		updateMutation,
		deleteMutation,
		emailDraft,
		setEmailDraft,
		firstNameDraft,
		setFirstNameDraft,
		lastNameDraft,
		setLastNameDraft,
	}
}

export {useCustomerDetailVm}
