import {cn} from '../../shared'

type ProductDescriptionProps = {
	children: React.ReactNode,
	snippeting?: React.ComponentType,
	className?: string,
}

function ProductDescription({
	children,
	snippeting: snippetingComponent,
	className = 'small-regular',
}: ProductDescriptionProps) {
	const Snippeting = snippetingComponent
	return (
		<p className={cn(className)}>
			{Snippeting
				? <Snippeting />
				: children}
		</p>
	)
}

export {ProductDescription}
export type {ProductDescriptionProps}
