import {cn} from '../lib/utils'

type ContainerProps = {
	children: React.ReactNode,
	className?: string,
}

function Container({children, className}: ContainerProps) {
	return (
		<div className={cn('container mx-auto px-4 lg:px-20', className)}>
			{children}
		</div>
	)
}

export {Container}
export type {ContainerProps}
