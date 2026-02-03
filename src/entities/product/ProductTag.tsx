import {cn} from '../../shared'

type ProductTagType = {
	label: string,
	theme?: 'default' | 'eco' | 'on-sale' | 'out-of-stock' | 'popular',
}

type ProductTagProps = ProductTagType

function ProductTag({label, theme = 'default'}: ProductTagProps) {
	return (
		<span className={cn(`tag-theme-${theme}`, 'rounded-sm px-2 py-0.5')}>
			{label}
		</span>
	)
}

export {ProductTag}
export type {ProductTagProps, ProductTagType}
