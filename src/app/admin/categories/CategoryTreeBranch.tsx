'use client'

import {type CategoryTreeNode} from '../../../entities/category'
import {CategoryListItem} from './CategoryListItem'

type CategoryTreeBranchProps = {
	node: CategoryTreeNode,
	depth: number,
}

function CategoryTreeBranch({
	node,
	depth,
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
			<CategoryListItem category={node} />
			{node.children.length > 0 && node.children.map(child => (
				<CategoryTreeBranch
					key={child.id}
					node={child}
					depth={depth + 1}
				/>
			))}
		</div>
	)
}

export {CategoryTreeBranch}
export type {CategoryTreeBranchProps}
