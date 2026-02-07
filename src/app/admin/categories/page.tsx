'use client'

import {useEffect} from 'react'
import {
	buildCategoryTree,
	useCategoriesQuery,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from '../../../entities/category'
import {
	AlertDialog,
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
	const newName = useCategoriesStore(s => s.newName)
	const newSlug = useCategoriesStore(s => s.newSlug)
	const newParentId = useCategoriesStore(s => s.newParentId)
	const highlightParentField = useCategoriesStore(s => s.highlightParentField)
	const deleteConfirmId = useCategoriesStore(s => s.deleteConfirmId)
	const setNewName = useCategoriesStore(s => s.setNewName)
	const setNewSlug = useCategoriesStore(s => s.setNewSlug)
	const setNewParentId = useCategoriesStore(s => s.setNewParentId)
	const setDeleteConfirmId = useCategoriesStore(s => s.setDeleteConfirmId)
	const setHighlightParentField = useCategoriesStore(s => s.setHighlightParentField)
	const setDeletePending = useCategoriesStore(s => s.setDeletePending)
	const setDeleteTargetId = useCategoriesStore(s => s.setDeleteTargetId)
	const resetCreateForm = useCategoriesStore(s => s.resetCreateForm)

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
					editId, editName, editSlug, setUpdatePending,
				} = useCategoriesStore.getState()
				if (!editId) {
					return
				}

				setUpdatePending(true)
				updateMutation.mutateAsync({
					id: editId,
					name: editName,
					slug: editSlug,
				}).then(() => {
					cancelEdit()
				})
					.catch(() => {})
					.finally(() => {
						useCategoriesStore.getState().setUpdatePending(false)
					})
			},
			onDelete: id => {
				setDeleteConfirmId(id)
			},
			onAddChild: cat => {
				setNewParentId(cat.id)
				setHighlightParentField(true)
				setTimeout(() => {
					useCategoriesStore.getState().setHighlightParentField(false)
				}, 2500)
			},
		})
	}, [
		setHandlers,
		cancelEdit,
		updateMutation,
		deleteMutation,
		setNewParentId,
		setHighlightParentField,
		setDeleteConfirmId,
	])

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
			resetCreateForm()
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

		setDeleteTargetId(id)
		setDeletePending(true)
		deleteMutation.mutateAsync(id)
			.finally(() => {
				useCategoriesStore.getState().setDeleteConfirmId(null)
				useCategoriesStore.getState().setDeletePending(false)
				useCategoriesStore.getState().setDeleteTargetId(null)
			})
			.catch(() => {})
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
						parentTree={buildCategoryTree(categories)}
						onNameChange={setNewName}
						onSlugChange={setNewSlug}
						onParentIdChange={setNewParentId}
						onSubmit={handleCreate}
						submitPending={createMutation.isPending}
						highlightParentField={highlightParentField}
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
						<Button
							variant="destructive"
							state={deleteMutation.isPending
								? 'loading'
								: 'default'}
							onClick={handleConfirmDelete}
						>
							{'Удалить'}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
