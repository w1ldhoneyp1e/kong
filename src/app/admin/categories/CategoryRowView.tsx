'use client'

import {type Category} from '../../../entities/category'
import {Badge, Button} from '../../../shared'

type CategoryRowViewProps = {
	category: Category,
	onEdit: (category: Category) => void,
	onDelete: (id: string) => void,
	onAddChild?: (category: Category) => void,
}

function CategoryRowView({
	category,
	onEdit,
	onDelete,
	onAddChild,
}: CategoryRowViewProps) {
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
				{onAddChild && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => onAddChild(category)}
					>
						{'Добавить подкатегорию'}
					</Button>
				)}
				<Button
					size="sm"
					variant="outline"
					onClick={() => onEdit(category)}
				>
					{'Изменить'}
				</Button>
				<Button
					size="sm"
					variant="destructive"
					onClick={() => onDelete(category.id)}
				>
					{'Удалить'}
				</Button>
			</div>
		</div>
	)
}

export {CategoryRowView}
export type {CategoryRowViewProps}
