type ProductColorsProps = {
	colors?: string[],
}

function ProductColors({colors}: ProductColorsProps) {
	if (!colors || colors.length === 0) {
		return null
	}

	return (
		<div className="flex -space-x-1.5">
			{colors.slice(0, 4).map(c => (
				<div
					key={`${c}-idx`}
					className="size-4 rounded-full border-2 border-background shadow-xs ring-1 ring-border/20"
					style={{backgroundColor: c}}
					title={c}
				/>
			))}
			{colors.length > 4 && (
				<div className="flex size-4 items-center justify-center rounded-full border-2 border-background bg-muted text-[8px] font-medium shadow-xs">
					{'+'}{colors.length - 4}
				</div>
			)}
		</div>
	)
}

export {
	ProductColors,
}
