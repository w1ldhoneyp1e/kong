'use client'

import {ChevronRight} from 'lucide-react'
import {type Category} from '../../../entities/category'
import {cn} from '../../../shared'
import {useCategoriesStore} from './categoriesStore'
import {CategoryEditForm} from './CategoryEditForm'
import {CategoryRowView} from './CategoryRowView'

type CategoryListItemProps = {
	category: Category,
	depth?: number,
	hasChildren?: boolean,
	isExpanded?: boolean,
	onToggle?: () => void,
}

function CategoryListItem({
	category,
	depth = 0,
	hasChildren = false,
	isExpanded = true,
	onToggle,
}: CategoryListItemProps) {
	const editId = useCategoriesStore(s => s.editId)
	const isEditing = editId === category.id
	const paddingLeft = depth === 0
		? 16
		: 16 + depth * 24

	return (
		<div className="border-b border-border/60 last:border-b-0">
			<div
				className="py-4 pr-5 rounded-md transition-colors hover:bg-muted/50"
				style={{paddingLeft: `${paddingLeft}px`}}
			>
				<div className="flex items-start gap-2">
					{hasChildren
						? (
							<button
								type="button"
								aria-expanded={isExpanded}
								onClick={onToggle}
								className={cn(
									'flex-shrink-0 mt-0.5 p-0.5 rounded hover:bg-muted',
									'text-muted-foreground hover:text-foreground',
								)}
							>
								<ChevronRight
									className={cn('h-5 w-5 transition-transform', isExpanded && 'rotate-90')}
								/>
							</button>
						)
						: (
							<span
								className="w-6 flex-shrink-0"
								aria-hidden={true}
							/>
						)}
					<div className="min-w-0 flex-1">
						{isEditing
							? <CategoryEditForm />
							: <CategoryRowView category={category} />}
					</div>
				</div>
			</div>
		</div>
	)
}

export {CategoryListItem}
export type {CategoryListItemProps}
