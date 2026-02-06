'use client'

import {type Category, type CategoryTreeNode} from '../../../entities/category'
import {CategoryListItem} from './CategoryListItem'

type CategoryTreeBranchProps = {
	node: CategoryTreeNode,
	depth: number,
	editId: string | null,
	editName: string,
	editSlug: string,
	onEditNameChange: (value: string) => void,
	onEditSlugChange: (value: string) => void,
	onUpdate: (ev: React.FormEvent) => void,
	onCancelEdit: () => void,
	onEdit: (category: Category) => void,
	onDelete: (id: string) => void,
	onAddChild: (category: Category) => void,
}

function CategoryTreeBranch({
	node,
	depth,
	editId,
	editName,
	editSlug,
	onEditNameChange,
	onEditSlugChange,
	onUpdate,
	onCancelEdit,
	onEdit,
	onDelete,
	onAddChild,
}: CategoryTreeBranchProps) {
	return (
		<div
			className="space-y-2"
			style={{
				marginLeft: depth > 0
					? depth * 20
					: 0,
			}}
		>
			<CategoryListItem
				category={node}
				isEditing={editId === node.id}
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
			{node.children.length > 0 && node.children.map(child => (
				<CategoryTreeBranch
					key={child.id}
					node={child}
					depth={depth + 1}
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
	)
}

export {CategoryTreeBranch}
export type {CategoryTreeBranchProps}
