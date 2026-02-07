'use client'

import {type Category, buildCategoryTree} from '../../../entities/category'
import {match} from '../../../shared'
import {CategoryTreeBranch} from './CategoryTreeBranch'

type CategoryListProps = {
	categories: Category[],
	loading: boolean,
}

function CategoryList({
	categories,
	loading,
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
						: `Всего: ${categories.length}`}
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
					<div>
						{tree.map(node => (
							<CategoryTreeBranch
								key={node.id}
								node={node}
								depth={0}
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
