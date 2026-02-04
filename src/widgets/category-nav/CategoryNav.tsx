'use client'

import {ChevronRight} from 'lucide-react'
import {useState} from 'react'
import {type CategoryTreeNode} from '../../entities/category'
import {
	cn,
	Collapse,
	Link,
} from '../../shared'

type CategoryNavItemProps = {
	node: CategoryTreeNode,
	depth?: number,
}

function CategoryNavItem({
	node,
	depth = 0,
}: CategoryNavItemProps) {
	const [open, setOpen] = useState(false)
	const hasChildren = node.children.length > 0
	const paddingLeft = depth === 0
		? 0
		: 12 + depth * 12

	return (
		<div className="border-b border-border/60 last:border-b-0">
			<div
				className={cn(
					'flex items-center gap-1.5 py-2.5 pr-2 rounded-md transition-colors',
					'hover:bg-muted/50',
				)}
				style={{
					paddingLeft: paddingLeft
						? `${paddingLeft}px`
						: undefined,
				}}
			>
				{hasChildren
					? (
						<button
							type="button"
							aria-expanded={open}
							onClick={() => setOpen(v => !v)}
							className="flex-shrink-0 p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
						>
							<ChevronRight
								className={cn('h-4 w-4 transition-transform', open && 'rotate-90')}
							/>
						</button>
					)
					: (
						<span
							className="w-5 flex-shrink-0"
							aria-hidden={true}
						/>
					)}
				<Link
					href={`/catalog/${node.slug}`}
					className={cn(
						'flex-1 min-w-0 text-sm py-0.5',
						depth === 0
							? 'font-medium text-foreground'
							: 'text-muted-foreground hover:text-foreground',
					)}
				>
					{node.name}
				</Link>
			</div>
			{hasChildren && (
				<Collapse isCollapsed={!open}>
					<div className="pl-1 pb-1">
						{node.children.map(child => (
							<CategoryNavItem
								key={child.id}
								node={child}
								depth={depth + 1}
							/>
						))}
					</div>
				</Collapse>
			)}
		</div>
	)
}

type CategoryNavProps = {
	tree: CategoryTreeNode[],
	className?: string,
}

function CategoryNav({tree, className}: CategoryNavProps) {
	if (tree.length === 0) {
		return (
			<nav className={className}>
				<div className="px-3 py-3">
					<Link
						href="/products"
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						{'Все товары'}
					</Link>
				</div>
			</nav>
		)
	}

	return (
		<nav
			className={cn(
				'overflow-hidden',
				className,
			)}
			aria-label="Каталог"
		>
			<div className="px-2 py-2">
				{tree.map(node => (
					<CategoryNavItem
						key={node.id}
						node={node}
					/>
				))}
			</div>
		</nav>
	)
}

export {
	CategoryNav,
	type CategoryNavProps,
}
