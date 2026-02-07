'use client'

import {useEffect, useState} from 'react'
import {
	buildCategoryTree,
	flattenCategoryTree,
	useCategoriesQuery,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from '../../../entities/category'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
} from '../../../shared'
import {useCategoriesStore} from './categoriesStore'
import {CategoryList} from './CategoryList'
import {CreateCategoryForm} from './CreateCategoryForm'

export default function CategoriesAdminPage() {
	const {
		data: categories = [],
		isLoading,
		error: queryError,
	} = useCategoriesQuery()
	const createMutation = useCreateCategoryMutation()
	const updateMutation = useUpdateCategoryMutation()
	const deleteMutation = useDeleteCategoryMutation()

	const cancelEdit = useCategoriesStore(s => s.cancelEdit)
	const setHandlers = useCategoriesStore(s => s.setHandlers)

	const [newName, setNewName] = useState('')
	const [newSlug, setNewSlug] = useState('')
	const [newParentId, setNewParentId] = useState<string | null>(null)
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

	const errorMessage = (err: unknown) => (err instanceof Error
		? err.message
		: String(err))
	const error
		= (queryError && errorMessage(queryError))
		?? (createMutation.error && errorMessage(createMutation.error))
		?? (updateMutation.error && errorMessage(updateMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

	useEffect(() => {
		setHandlers({
			onUpdate: e => {
				e.preventDefault()
				const {
					editId, editName, editSlug,
				} = useCategoriesStore.getState()
				if (!editId) {
					return
				}

				updateMutation.mutateAsync({
					id: editId,
					name: editName,
					slug: editSlug,
				}).then(() => {
					cancelEdit()
				})
					.catch(() => {})
			},
			onDelete: id => {
				setDeleteConfirmId(id)
			},
			onAddChild: cat => {
				setNewParentId(cat.id)
			},
		})
	}, [setHandlers, cancelEdit, updateMutation, deleteMutation, setNewParentId])

	const handleCreate = async (ev: React.FormEvent) => {
		ev.preventDefault()

		if (!newName || !newSlug) {
			return
		}

		try {
			await createMutation.mutateAsync({
				name: newName,
				slug: newSlug,
				parentId: newParentId,
			})
			setNewName('')
			setNewSlug('')
			setNewParentId(null)
		}
		catch {
			// error shown via mutation.error
		}
	}

	const handleConfirmDelete = () => {
		const id = deleteConfirmId
		if (!id) {
			return
		}

		setDeleteConfirmId(null)
		deleteMutation.mutateAsync(id).catch(() => {})
	}

	return (
		<div className="flex flex-col gap-5">
			<h1 className="heading-4">{'Управление категориями'}</h1>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div>
					<CreateCategoryForm
						name={newName}
						slug={newSlug}
						parentId={newParentId}
						parentOptions={flattenCategoryTree(buildCategoryTree(categories))}
						onNameChange={setNewName}
						onSlugChange={setNewSlug}
						onParentIdChange={setNewParentId}
						onSubmit={handleCreate}
						submitPending={createMutation.isPending}
					/>
				</div>
				<CategoryList
					categories={categories}
					loading={isLoading}
				/>
			</div>
			<AlertDialog
				open={deleteConfirmId !== null}
				onOpenChange={open => {
					if (!open) {
						setDeleteConfirmId(null)
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{'Удалить категорию?'}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{'Точно удалить категорию? Это действие нельзя отменить.'}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel asChild={true}>
							<Button variant="outline">
								{'Отмена'}
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild={true}>
							<Button
								variant="destructive"
								onClick={handleConfirmDelete}
							>
								{'Удалить'}
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
