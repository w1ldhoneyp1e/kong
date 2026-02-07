'use client'

import {Button, Input} from '../../../shared'
import {useCategoriesStore} from './categoriesStore'

function CategoryEditForm() {
	const editName = useCategoriesStore(s => s.editName)
	const editSlug = useCategoriesStore(s => s.editSlug)
	const setEditName = useCategoriesStore(s => s.setEditName)
	const setEditSlug = useCategoriesStore(s => s.setEditSlug)
	const update = useCategoriesStore(s => s.update)
	const cancelEdit = useCategoriesStore(s => s.cancelEdit)
	const updatePending = useCategoriesStore(s => s.updatePending)

	return (
		<form
			onSubmit={update}
			className="space-y-3"
		>
			<div>
				<label className="text-sm font-medium mb-1 block">
					{'Название'}
				</label>
				<Input
					type="text"
					value={editName}
					onChange={e => setEditName(e.target.value)}
				/>
			</div>
			<div>
				<label className="text-sm font-medium mb-1 block">
					{'URL'}
				</label>
				<Input
					type="text"
					value={editSlug}
					onChange={e => setEditSlug(e.target.value)}
				/>
			</div>
			<div className="flex gap-2">
				<Button
					type="submit"
					size="sm"
					state={updatePending
						? 'loading'
						: (!editName.trim() || !editSlug.trim()
							? 'disabled'
							: 'default')}
				>
					{'Сохранить'}
				</Button>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={cancelEdit}
				>
					{'Отмена'}
				</Button>
			</div>
		</form>
	)
}

export {CategoryEditForm}
