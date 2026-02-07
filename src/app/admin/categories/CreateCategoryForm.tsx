'use client'

import {type CategoryTreeNode} from '../../../entities/category'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
} from '../../../shared'
import {ParentCategorySelect} from './ParentCategorySelect'

type CreateCategoryFormProps = {
	name: string,
	slug: string,
	parentId: string | null,
	parentTree: CategoryTreeNode[],
	onNameChange: (value: string) => void,
	onSlugChange: (value: string) => void,
	onParentIdChange: (value: string | null) => void,
	onSubmit: (ev: React.FormEvent) => void,
	submitPending?: boolean,
	highlightParentField?: boolean,
}

function CreateCategoryForm({
	name,
	slug,
	parentId,
	parentTree,
	onNameChange,
	onSlugChange,
	onParentIdChange,
	onSubmit,
	submitPending = false,
	highlightParentField = false,
}: CreateCategoryFormProps) {
	return (
		<div className="lg:col-span-1">
			<Card>
				<CardHeader>
					<CardTitle>{'Создать категорию'}</CardTitle>
					<CardDescription>{'Добавь новую категорию или подкатегорию'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className="space-y-4"
					>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Родительская категория'}
							</label>
							<ParentCategorySelect
								parentId={parentId}
								parentTree={parentTree}
								onParentIdChange={onParentIdChange}
								highlightParentField={highlightParentField}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Название'}
							</label>
							<Input
								type="text"
								placeholder="Электроника"
								value={name}
								onChange={e => onNameChange(e.target.value)}
							/>
						</div>
						<div>
							<label className="text-sm font-medium mb-1 block">
								{'Путь (url-адрес)'}
							</label>
							<Input
								type="text"
								placeholder="electronics"
								value={slug}
								onChange={e => onSlugChange(e.target.value)}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							state={submitPending
								? 'loading'
								: (!name.trim() || !slug.trim()
									? 'disabled'
									: 'default')}
						>
							{'Создать'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export {
	CreateCategoryForm,
	type CreateCategoryFormProps,
}
