'use client'

import {type Category} from '../../../entities/category'
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
} from '../../../shared'

type CategoryListProps = {
	categories: Category[]
	loading: boolean
	editId: string | null
	editName: string
	editSlug: string
	onEditNameChange: (value: string) => void
	onEditSlugChange: (value: string) => void
	onEdit: (category: Category) => void
	onUpdate: (ev: React.FormEvent) => void
	onDelete: (id: string) => void
	onCancelEdit: () => void
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
					{loading
						? (
							<p className="text-center py-8 text-muted-foreground">
								{'Загрузка...'}
							</p>
						)
						: categories.length === 0
							? (
								<p className="text-center py-8 text-muted-foreground">
									{'Категорий пока нет. Создай первую!'}
								</p>
							)
							: (
								<div className="space-y-4">
									{categories.map(category => (
										<div
											key={category.id}
											className="border rounded-lg p-4"
										>
											{editId === category.id
												? (
													<form
														onSubmit={onUpdate}
														className="space-y-3"
													>
														<div>
															<label className="text-sm font-medium mb-1 block">
																{'Название'}
															</label>
															<Input
																type="text"
																value={editName}
																onChange={e => onEditNameChange(e.target.value)}
															/>
														</div>
														<div>
															<label className="text-sm font-medium mb-1 block">
																{'Slug'}
															</label>
															<Input
																type="text"
																value={editSlug}
																onChange={e => onEditSlugChange(e.target.value)}
															/>
														</div>
														<div className="flex gap-2">
															<Button
																type="submit"
																size="sm"
															>
																{'Сохранить'}
															</Button>
															<Button
																type="button"
																size="sm"
																variant="outline"
																onClick={onCancelEdit}
															>
																{'Отмена'}
															</Button>
														</div>
													</form>
												)
												: (
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
														<div className="flex gap-2">
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
												)}
										</div>
									))}
								</div>
							)}
				</CardContent>
			</Card>
		</div>
	)
}

export {CategoryList}
export type {CategoryListProps}
