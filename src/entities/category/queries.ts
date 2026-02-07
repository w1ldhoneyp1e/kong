'use client'

import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import {type Category, api as categoriesApi} from './api'

const categoriesQueryKey = ['categories'] as const

function useCategoriesQuery() {
	return useQuery({
		queryKey: categoriesQueryKey,
		queryFn: () => categoriesApi.getAll(),
	})
}

function useCreateCategoryMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			name,
			slug,
			parentId,
		}: {
			name: string,
			slug: string,
			parentId?: string | null,
		}) => categoriesApi.create(name, slug, parentId),
		onSuccess: (result, variables) => {
			const newCategory: Category = {
				id: result.id,
				name: variables.name,
				slug: variables.slug,
				parentId: variables.parentId ?? null,
			}
			queryClient.setQueryData<Category[]>(categoriesQueryKey, prev =>
				prev
					? [...prev, newCategory]
					: [newCategory],
			)
		},
	})
}

function useUpdateCategoryMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			id,
			name,
			slug,
		}: {
			id: string,
			name: string,
			slug: string,
		}) => categoriesApi.update(id, name, slug),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: categoriesQueryKey})
		},
	})
}

function useDeleteCategoryMutation() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string) => categoriesApi.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: categoriesQueryKey})
		},
	})
}

export {
	useCategoriesQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
}
