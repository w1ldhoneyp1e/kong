'use client'

import {useEffect, useState} from 'react'
import {type Category, categoriesApi} from '../../../entities/category'
import {CategoryList} from './CategoryList'
import {CreateCategoryForm} from './CreateCategoryForm'

export default function CategoriesAdminPage() {
	const [categories, setCategories] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	const [newName, setNewName] = useState('')
	const [newSlug, setNewSlug] = useState('')

	const [editId, setEditId] = useState<string | null>(null)
	const [editName, setEditName] = useState('')
	const [editSlug, setEditSlug] = useState('')

	const loadCategories = async () => {
		try {
			setLoading(true)
			const data = await categoriesApi.getAll()
			setCategories(data)
			setError('')
		}
		catch (err) {
			setError(err instanceof Error
				? err.message
				: 'Ошибка загрузки категорий. Проверь, что backend запущен.')
		}
		finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadCategories()
	}, [])

	const handleCreate = async (ev: React.FormEvent) => {
		ev.preventDefault()

		if (!newName || !newSlug) {
			setError('Заполни все поля')

			return
		}

		try {
			await categoriesApi.create(newName, newSlug)
			setNewName('')
			setNewSlug('')
			await loadCategories()
			setError('')
		}
		catch (err) {
			setError(err instanceof Error
				? err.message
				: 'Ошибка создания категории')
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
			await categoriesApi.update(editId, editName, editSlug)
			setEditId(null)
			setEditName('')
			setEditSlug('')
			await loadCategories()
			setError('')
		}
		catch {
			setError('Ошибка обновления категории')
		}
	}

	const handleDelete = async (id: string) => {
		// eslint-disable-next-line no-alert -- подтверждение удаления в админке
		if (!confirm('Точно удалить категорию?')) {
			return
		}

		try {
			await categoriesApi.delete(id)
			await loadCategories()
			setError('')
		}
		catch {
			setError('Ошибка удаления категории')
		}
	}

	const handleCancelEdit = () => {
		setEditId(null)
		setEditName('')
		setEditSlug('')
	}

	return (
		<div className="container flex flex-col gap-5">
			<h1 className="heading-4">{'Управление категориями'}</h1>
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			)}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<CreateCategoryForm
					name={newName}
					slug={newSlug}
					onNameChange={setNewName}
					onSlugChange={setNewSlug}
					onSubmit={handleCreate}
				/>
				<CategoryList
					categories={categories}
					loading={loading}
					editId={editId}
					editName={editName}
					editSlug={editSlug}
					onEditNameChange={setEditName}
					onEditSlugChange={setEditSlug}
					onEdit={handleEdit}
					onUpdate={handleUpdate}
					onDelete={handleDelete}
					onCancelEdit={handleCancelEdit}
				/>
			</div>
		</div>
	)
}


