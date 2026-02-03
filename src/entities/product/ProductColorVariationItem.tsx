import {Button} from '../../shared'

type ProductColorVariationItemProps = {
	color: string,
}

function ProductColorVariationItem({color}: ProductColorVariationItemProps) {
	return (
		<li>
			<Button
				variant="ghost"
				size="icon-sm"
				title="Show color variation"
				className="p-0 hover:bg-transparent"
			>
				<div
					className="w-4 h-4 rounded-full border border-solid"
					style={{
						backgroundColor: color,
						borderColor: 'var(--color-neutral-dark)',
					}}
				/>
			</Button>
		</li>
	)
}

export {ProductColorVariationItem}
export type {ProductColorVariationItemProps}
