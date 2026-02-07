'use client'

import {Pencil, Trash2} from 'lucide-react'
import {type Category} from '../../../entities/category'
import {Button, cn} from '../../../shared'
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
				<h3 className="font-semibold text-xl">
					{category.name}
				</h3>
				<p className="mt-1 text-sm text-muted-foreground">
					{`/catalog/${category.slug}`}
				</p>
			</div>
			<div
				className={cn(
					'flex gap-2 flex-wrap transition-opacity',
					'opacity-0 group-hover:opacity-100 focus-within:opacity-100',
					isDeleting && 'opacity-100',
				)}
			>
				<Button
					size="sm"
					variant="outline"
					className="text-foreground/70"
					onClick={() => addChild(category)}
				>
					{'Добавить подкатегорию'}
				</Button>
				<Button
					className="text-foreground/70"
					size="icon-sm"
					variant="outline"
					onClick={() => setEdit(category)}
					aria-label="Изменить"
				>
					<Pencil className="size-4" />
				</Button>
				<Button
					size="icon-sm"
					variant="destructive"
					state={isDeleting
						? 'loading'
						: 'default'}
					onClick={() => deleteCategory(category.id)}
					aria-label="Удалить"
				>
					<Trash2 className="size-4" />
				</Button>
			</div>
		</div>
	)
}

export {CategoryRowView}
export type {CategoryRowViewProps}
