'use client'

import {type Category} from '../../../entities/category'
import {useCategoriesStore} from './categoriesStore'
import {CategoryEditForm} from './CategoryEditForm'
import {CategoryRowView} from './CategoryRowView'

type CategoryListItemProps = {
	category: Category,
}

function CategoryListItem({category}: CategoryListItemProps) {
	const editId = useCategoriesStore(s => s.editId)
	const isEditing = editId === category.id

	return (
		<div className="border rounded-lg p-4">
			{isEditing
				? <CategoryEditForm />
				: <CategoryRowView category={category} />}
		</div>
	)
}

export {CategoryListItem}
export type {CategoryListItemProps}
