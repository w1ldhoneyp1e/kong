'use client'

import {type Category} from '../../../entities/category'
import {Badge, Button} from '../../../shared'
import {useCategoriesStore} from './categoriesStore'

type CategoryRowViewProps = {
	category: Category,
}

function CategoryRowView({category}: CategoryRowViewProps) {
	const deleteTargetId = useCategoriesStore(s => s.deleteTargetId)
	const deletePending = useCategoriesStore(s => s.deletePending)
	const setEdit = useCategoriesStore(s => s.setEdit)
	const deleteCategory = useCategoriesStore(s => s.deleteCategory)
	const addChild = useCategoriesStore(s => s.addChild)

	const isDeleting = deleteTargetId === category.id && deletePending

	return (
		<div className="flex items-center justify-between">
			<div>
				<h3 className="font-semibold text-lg">
					{category.name}
				</h3>
				<Badge
					variant="secondary"
					className="mt-1"
				>
					{category.slug}
				</Badge>
			</div>
			<div className="flex gap-2 flex-wrap">
				<Button
					size="sm"
					variant="outline"
					onClick={() => addChild(category)}
				>
					{'Добавить подкатегорию'}
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setEdit(category)}
				>
					{'Изменить'}
				</Button>
				<Button
					size="sm"
					variant="destructive"
					state={isDeleting
						? 'loading'
						: 'default'}
					onClick={() => deleteCategory(category.id)}
				>
					{'Удалить'}
				</Button>
			</div>
		</div>
	)
}

export {CategoryRowView}
export type {CategoryRowViewProps}
