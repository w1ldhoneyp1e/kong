import {cn} from '../../lib/utils'

type ProductLabelProps = {
	children: React.ReactNode,
	highlighting?: React.ComponentType,
	className?: string,
}

function ProductLabel({
	children,
	highlighting: highlightingComponent,
	className = 'tag-bold tracking-normal',
}: ProductLabelProps) {
	const Highlighting = highlightingComponent
	return (
		<h2
			className={cn(className)}
			style={{color: 'var(--color-neutral-darkest)'}}
		>
			{Highlighting
				? <Highlighting />
				: children}
		</h2>
	)
}

export {ProductLabel}
export type {ProductLabelProps}
