'use client'

import {type Category} from '../../../entities/category'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	match,
} from '../../../shared'
import {CategoryListItem} from './CategoryListItem'

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
}: CategoryListProps) {
	const contentState = loading
		? 'loading'
		: categories.length === 0
			? 'empty'
			: 'list'

	return (
		<div className="lg:col-span-2">
			<Card>
				<CardHeader>
					<CardTitle>{'Список категорий'}</CardTitle>
					<CardDescription>
						{loading
							? 'Загрузка...'
							: `Найдено: ${categories.length}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
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
							<div className="space-y-4">
								{categories.map(category => (
									<CategoryListItem
										key={category.id}
										category={category}
										isEditing={editId === category.id}
										editName={editName}
										editSlug={editSlug}
										onEditNameChange={onEditNameChange}
										onEditSlugChange={onEditSlugChange}
										onUpdate={onUpdate}
										onCancelEdit={onCancelEdit}
										onEdit={onEdit}
										onDelete={onDelete}
									/>
								))}
							</div>
						),
					})}
				</CardContent>
			</Card>
		</div>
	)
}

export {CategoryList}
export type {CategoryListProps}
