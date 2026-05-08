type ProductTitleProps = {
	title?: string,
	titleHighlighting?: React.ComponentType,
}

function ProductTitle({
	title,
	titleHighlighting: titleHighlightingComp,
}: ProductTitleProps) {
	const TitleHighlighting = titleHighlightingComp

	return (
		<h3 className="mb-1 line-clamp-2 text-base font-semibold leading-tight tracking-tight">
			{TitleHighlighting
				? <TitleHighlighting />
				: title}
		</h3>
	)
}

export {
	ProductTitle,
}
