'use client'

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
	onNameChange: (value: string) => void,
	onSlugChange: (value: string) => void,
	onSubmit: (ev: React.FormEvent) => void,
}

function CreateCategoryForm({
	name,
	slug,
	onNameChange,
	onSlugChange,
	onSubmit,
}: CreateCategoryFormProps) {
	return (
		<div className="lg:col-span-1">
			<Card>
				<CardHeader>
					<CardTitle>{'Создать категорию'}</CardTitle>
					<CardDescription>{'Добавь новую категорию товаров'}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className="space-y-4"
					>
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
