'use client'

import {cn} from '../lib/utils'

type CollapseProps = {
	isCollapsed: boolean,
	className?: string,
	children: React.ReactNode,
}

function Collapse({
	isCollapsed, className, children,
}: CollapseProps) {
	return (
		<div
			className={cn('grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out', className)}
			style={{
				gridTemplateRows: isCollapsed
					? '0fr'
					: '1fr',
			}}
		>
			<div className="min-h-0">
				{children}
			</div>
		</div>
	)
}

export {Collapse}
export type {CollapseProps}
