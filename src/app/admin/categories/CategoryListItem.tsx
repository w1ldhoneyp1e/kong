'use client'

import {type Category} from '../../../entities/category'
import {CategoryEditForm} from './CategoryEditForm'
import {CategoryRowView} from './CategoryRowView'

type CategoryListItemProps = {
	category: Category,
	isEditing: boolean,
	editName: string,
	editSlug: string,
	onEditNameChange: (value: string) => void,
	onEditSlugChange: (value: string) => void,
	onUpdate: (ev: React.FormEvent) => void,
	onCancelEdit: () => void,
	onEdit: (category: Category) => void,
	onDelete: (id: string) => void,
	onAddChild?: (category: Category) => void,
}

function CategoryListItem({
	category,
	isEditing,
	editName,
	editSlug,
	onEditNameChange,
	onEditSlugChange,
	onUpdate,
	onCancelEdit,
	onEdit,
	onDelete,
	onAddChild,
}: CategoryListItemProps) {
	return (
		<div className="border rounded-lg p-4">
			{isEditing
				? (
					<CategoryEditForm
						name={editName}
						slug={editSlug}
						onNameChange={onEditNameChange}
						onSlugChange={onEditSlugChange}
						onSubmit={onUpdate}
						onCancel={onCancelEdit}
					/>
				)
				: (
					<CategoryRowView
						category={category}
						onEdit={onEdit}
						onDelete={onDelete}
						onAddChild={onAddChild}
					/>
				)}
		</div>
	)
}

export {CategoryListItem}
export type {CategoryListItemProps}
