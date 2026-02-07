'use client'

import {type FlattenCategoryItem} from '../../../entities/category'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
} from '../../../shared'

type CreateCategoryFormProps = {
	name: string,
	slug: string,
	parentId: string | null,
	parentOptions: FlattenCategoryItem[],
	onNameChange: (value: string) => void,
	onSlugChange: (value: string) => void,
	onParentIdChange: (value: string | null) => void,
	onSubmit: (ev: React.FormEvent) => void,
}

function CreateCategoryForm({
	name,
	slug,
	parentId,
	parentOptions,
	onNameChange,
	onSlugChange,
	onParentIdChange,
	onSubmit,
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
							<select
								className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
								value={parentId ?? ''}
								onChange={e => onParentIdChange(e.target.value === ''
									? null
									: e.target.value)}
							>
								<option value="">
									{'Без родителя'}
								</option>
								{parentOptions.map(args => (
									<option
										key={args.id}
										value={args.id}
									>
										{'\u00A0'.repeat(args.depth * 2)}{args.name}
									</option>
								))}
							</select>
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
								{'Slug (URL)'}
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
