'use client'

import {Button, Input} from '../../../shared'

type CategoryEditFormProps = {
	name: string,
	slug: string,
	onNameChange: (value: string) => void,
	onSlugChange: (value: string) => void,
	onSubmit: (ev: React.FormEvent) => void,
	onCancel: () => void,
}

function CategoryEditForm({
	name,
	slug,
	onNameChange,
	onSlugChange,
	onSubmit,
	onCancel,
}: CategoryEditFormProps) {
	return (
		<form
			onSubmit={onSubmit}
			className="space-y-3"
		>
			<div>
				<label className="text-sm font-medium mb-1 block">
					{'Название'}
				</label>
				<Input
					type="text"
					value={name}
					onChange={e => onNameChange(e.target.value)}
				/>
			</div>
			<div>
				<label className="text-sm font-medium mb-1 block">
					{'Slug'}
				</label>
				<Input
					type="text"
					value={slug}
					onChange={e => onSlugChange(e.target.value)}
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
					onClick={onCancel}
				>
					{'Отмена'}
				</Button>
			</div>
		</form>
	)
}

export {CategoryEditForm}
export type {CategoryEditFormProps}
