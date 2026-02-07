'use client'

import {useRef, useState} from 'react'
import {
	type Category,
	buildCategoryTree,
	flattenCategoryTree,
	useCategoriesQuery,
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from '../../../entities/category'
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

	const [newName, setNewName] = useState('')
	const [newSlug, setNewSlug] = useState('')
	const [newParentId, setNewParentId] = useState<string | null>(null)

	const createFormRef = useRef<HTMLDivElement>(null)
	const [editId, setEditId] = useState<string | null>(null)
	const [editName, setEditName] = useState('')
	const [editSlug, setEditSlug] = useState('')

	const errorMessage = (err: unknown) => (err instanceof Error
		? err.message
		: String(err))
	const error
		= (queryError && errorMessage(queryError))
		?? (createMutation.error && errorMessage(createMutation.error))
		?? (updateMutation.error && errorMessage(updateMutation.error))
		?? (deleteMutation.error && errorMessage(deleteMutation.error))
		?? ''

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

	const handleEdit = (category: Category) => {
		setEditId(category.id)
		setEditName(category.name)
		setEditSlug(category.slug)
	}

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!editId) {
			return
		}

		try {
			await updateMutation.mutateAsync({
				id: editId,
				name: editName,
				slug: editSlug,
			})
			setEditId(null)
			setEditName('')
			setEditSlug('')
		}
		catch {
			// error shown via mutation.error
		}
	}

	const handleDelete = async (id: string) => {
		// eslint-disable-next-line no-alert -- подтверждение удаления в админке
		if (!confirm('Точно удалить категорию?')) {
			return
		}

		try {
			await deleteMutation.mutateAsync(id)
		}
		catch {
			// error shown via mutation.error
		}
	}

	const handleCancelEdit = () => {
		setEditId(null)
		setEditName('')
		setEditSlug('')
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
				<div ref={createFormRef}>
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
					editId={editId}
					editName={editName}
					editSlug={editSlug}
					onEditNameChange={setEditName}
					onEditSlugChange={setEditSlug}
					onEdit={handleEdit}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
					onCancelEdit={handleCancelEdit}
					onAddChild={cat => {
						setNewParentId(cat.id)
						createFormRef.current?.scrollIntoView({behavior: 'smooth'})
					}}
				/>
			</div>
		</div>
	)
}
