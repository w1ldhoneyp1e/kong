'use client'

import {type Category, buildCategoryTree} from '../../../entities/category'
import {match} from '../../../shared'
import {CategoryTreeBranch} from './CategoryTreeBranch'

type CategoryListProps = {
	categories: Category[],
	loading: boolean,
	editId: string | null,
	editName: string,
	editSlug: string,
	onEditNameChange: (value: string) => void,
	onEditSlugChange: (value: string) => void,
	onEdit: (category: Category) => void,
	onUpdate: (ev: React.FormEvent) => void,
	onDelete: (id: string) => void,
	onCancelEdit: () => void,
	onAddChild: (category: Category) => void,
}

function CategoryList({
	categories,
	loading,
	editId,
	editName,
	editSlug,
	onEditNameChange,
	onEditSlugChange,
	onEdit,
	onUpdate,
	onDelete,
	onCancelEdit,
	onAddChild,
}: CategoryListProps) {
	const tree = buildCategoryTree(categories)
	const contentState = loading
		? 'loading'
		: tree.length === 0
			? 'empty'
			: 'list'

	return (
		<div className="lg:col-span-2 space-y-4">
			<div>
				<h2 className="text-lg font-semibold">{'Список категорий'}</h2>
				<p className="text-sm text-muted-foreground">
					{loading
						? 'Загрузка...'
						: `Найдено: ${categories.length}`}
				</p>
			</div>
			{match(contentState, {
				loading: () => (
					<p className="text-center py-8 text-muted-foreground">
						{'Загрузка...'}
					</p>
				),
				empty: () => (
					<p className="text-center py-8 text-muted-foreground">
						{'Категорий пока нет. Создай первую!'}
					</p>
				),
				list: () => (
					<div className="space-y-2">
						{tree.map(node => (
							<CategoryTreeBranch
								key={node.id}
								node={node}
								depth={0}
								editId={editId}
								editName={editName}
								editSlug={editSlug}
								onEditNameChange={onEditNameChange}
								onEditSlugChange={onEditSlugChange}
								onUpdate={onUpdate}
								onCancelEdit={onCancelEdit}
								onEdit={onEdit}
								onDelete={onDelete}
								onAddChild={onAddChild}
							/>
						))}
					</div>
				),
			})}
		</div>
	)
}

export {CategoryList}
export type {CategoryListProps}
