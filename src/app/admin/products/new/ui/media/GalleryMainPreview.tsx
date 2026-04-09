type GalleryMainPreviewProps = {
	url: string,
	hasSlides: boolean,
}

function GalleryMainPreview({url, hasSlides}: Readonly<GalleryMainPreviewProps>) {
	const hasImage = hasSlides && url.trim().length > 0

	return (
		<div className="overflow-hidden rounded-md border">
			<div className="relative aspect-video bg-muted/30">
				{hasImage
					? (
						<img
							src={url}
							alt=""
							className="h-full w-full object-cover"
						/>
					)
					: (
						<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
							{'Нет изображений'}
						</div>
					)}
			</div>
		</div>
	)
}

export {GalleryMainPreview}
