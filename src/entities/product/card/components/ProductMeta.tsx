import {ProductColors} from './ProductColors'

type ProductMetaProps = {
	label?: string,
	labelHighlighting?: React.ComponentType,
	colors?: string[],
}

function ProductMeta({
	label,
	labelHighlighting: labelHighlightingComp,
	colors,
}: ProductMetaProps) {
	const LabelHighlighting = labelHighlightingComp
	return (
		<div className="mb-2 flex items-center justify-between gap-4">
			<span className="text-xs font-bold tracking-widest text-muted-foreground uppercase truncate">
				{LabelHighlighting
					? <LabelHighlighting />
					: label}
			</span>
			<ProductColors colors={colors} />
		</div>
	)
}

export {
	ProductMeta,
}
