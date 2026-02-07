'use client'

import {useState} from 'react'
import {type CategoryTreeNode} from '../../../entities/category'
import {Collapse} from '../../../shared'
import {CategoryListItem} from './CategoryListItem'

type CategoryTreeBranchProps = {
	node: CategoryTreeNode,
	depth: number,
}

function CategoryTreeBranch({
	node,
	depth,
}: CategoryTreeBranchProps) {
	const [open, setOpen] = useState(true)
	const hasChildren = node.children.length > 0

	return (
		<>
			<CategoryListItem
				category={node}
				depth={depth}
				hasChildren={hasChildren}
				isExpanded={open}
				onToggle={() => setOpen(v => !v)}
			/>
			{hasChildren && (
				<Collapse isCollapsed={!open}>
					<div>
						{node.children.map(child => (
							<CategoryTreeBranch
								key={child.id}
								node={child}
								depth={depth + 1}
							/>
						))}
					</div>
				</Collapse>
			)}
		</>
	)
}

export {CategoryTreeBranch}
export type {CategoryTreeBranchProps}
