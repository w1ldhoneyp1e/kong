type ProductDescriptionProps = {
	description?: string,
	descriptionSnippeting?: React.ComponentType,
	isGrid: boolean,
}

function ProductDescription({
	description,
	descriptionSnippeting: descriptionSnippetingComp,
	isGrid,
}: ProductDescriptionProps) {
	if (isGrid) {
		return null
	}

	const DescriptionSnippeting = descriptionSnippetingComp

	return (
		<div className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-2xl">
			{DescriptionSnippeting
				? <DescriptionSnippeting />
				: description}
		</div>
	)
}

export {
	ProductDescription,
}
