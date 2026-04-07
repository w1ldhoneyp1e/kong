import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {Button} from '../../../../../shared'

function UploadPhotoSection({
	imagesCount,
	thumbnailUrl,
	galleryImages,
	disabled,
	onOpenMediaModal,
}: Readonly<{
	imagesCount: number,
	thumbnailUrl: string,
	galleryImages: string[],
	disabled: boolean,
	onOpenMediaModal: () => void,
}>) {
	const additionalText = imagesCount > 0
		? ` (${imagesCount} выбрано)`
		: ''
	const slides = useMemo(() => {
		const base = [
			thumbnailUrl.trim(),
			...galleryImages.map(item => item.trim()),
		].filter(Boolean)

		return Array.from(new Set(base))
	}, [galleryImages, thumbnailUrl])
	const hasSlides = slides.length > 0
	const [currentSlide, setCurrentSlide] = useState(0)

	useEffect(() => {
		if (currentSlide > slides.length - 1) {
			setCurrentSlide(0)
		}
	}, [currentSlide, slides.length])

	const canPrev = hasSlides && currentSlide > 0
	const canNext = hasSlides && currentSlide < slides.length - 1
	const shownUrl = hasSlides
		? slides[currentSlide]
		: ''

	return (
		<section className="space-y-3">
			<h3 className="text-sm font-medium text-muted-foreground">
				{`Фото${additionalText}`}
			</h3>
			<div className="space-y-2">
				<div className="overflow-hidden rounded-md border">
					<div className="relative aspect-video bg-muted/30">
						{hasSlides
							? (
								<img
									src={shownUrl}
									alt=""
									className="h-full w-full object-cover"
								/>
							)
							: (
								<div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
									{'16:9'}
								</div>
							)}
					</div>
				</div>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={disabled || !canPrev}
							onClick={() => {
								setCurrentSlide(value => Math.max(0, value - 1))
							}}
						>
							{'Назад'}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={disabled || !canNext}
							onClick={() => {
								setCurrentSlide(value => Math.min(slides.length - 1, value + 1))
							}}
						>
							{'Вперед'}
						</Button>
						<span className="text-xs text-muted-foreground">
							{hasSlides
								? `${currentSlide + 1} / ${slides.length}`
								: '0 / 0'}
						</span>
					</div>
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						onClick={onOpenMediaModal}
					>
						{'Загрузить'}
					</Button>
				</div>
			</div>
		</section>
	)
}

export {UploadPhotoSection}
