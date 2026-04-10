import {ChevronLeft, ChevronRight} from 'lucide-react'
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {Button} from '../../../shared'
import {type AdminProductFormViewmodel} from '../viewmodel'
import {GalleryMainPreview} from './media/GalleryMainPreview'
import {GalleryThumbsStrip} from './media/GalleryThumbsStrip'

type UploadPhotoSectionProps = {
	media: AdminProductFormViewmodel['media'],
}

function UploadPhotoSection({
	media,
}: UploadPhotoSectionProps) {
	const slides = useMemo(
		() => media.galleryImages.map(item => item.url.trim()).filter(Boolean),
		[media.galleryImages],
	)
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
		? (slides[currentSlide] ?? '')
		: ''

	const galleryCount = media.galleryImages.length
	const additionalText = galleryCount > 0
		? ` (${galleryCount} в галерее)`
		: ''

	return (
		<section className="space-y-3">
			<h3 className="text-sm font-medium text-muted-foreground">
				{`Фото${additionalText}`}
			</h3>
			{hasSlides
				? (
					<p className="text-xs text-muted-foreground">
						{'Крупное окно — выбранное фото; ряд миниатюр — весь список. Перетащите миниатюру, чтобы изменить порядок; первое в ряду — основное для витрины.'}
					</p>
				)
				: (
					<p className="text-xs text-muted-foreground">
						{'Добавьте фото через «Загрузить»: после этого здесь появятся превью и перестановка.'}
					</p>
				)}
			<div className="space-y-3">
				<GalleryMainPreview
					url={shownUrl}
					hasSlides={hasSlides}
				/>
				<GalleryThumbsStrip
					items={media.galleryImages}
					disabled={media.disabled}
					currentSlide={currentSlide}
					onSlideSelect={setCurrentSlide}
					onReorder={media.onReorderGallery}
				/>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="size-8"
							aria-label="Предыдущее фото"
							disabled={media.disabled || !canPrev}
							onClick={() => {
								setCurrentSlide(value => Math.max(0, value - 1))
							}}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<Button
							type="button"
							variant="outline"
							size="icon"
							className="size-8"
							aria-label="Следующее фото"
							disabled={media.disabled || !canNext}
							onClick={() => {
								setCurrentSlide(value => Math.min(slides.length - 1, value + 1))
							}}
						>
							<ChevronRight className="size-4" />
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
						disabled={media.disabled}
						onClick={media.onOpen}
					>
						{'Загрузить'}
					</Button>
				</div>
			</div>
		</section>
	)
}

export {UploadPhotoSection}
