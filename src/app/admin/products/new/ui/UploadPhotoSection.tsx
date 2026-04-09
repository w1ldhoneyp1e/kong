import {
	ChevronLeft,
	ChevronRight,
	GripVertical,
} from 'lucide-react'
import {
	useEffect,
	useMemo,
	useState,
} from 'react'
import {Button, cn} from '../../../../../shared'
import {useProductCreateVm} from '../viewmodel'

const GALLERY_DRAG_MIME = 'application/x-kong-gallery-index'

function UploadPhotoSection() {
	const {media} = useProductCreateVm()
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
		? slides[currentSlide]
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
									{'Нет изображений'}
								</div>
							)}
					</div>
				</div>
				{hasSlides
					? (
						<div
							className="flex flex-wrap gap-2"
							role="list"
							aria-label="Превью изображений"
						>
							{media.galleryImages.map((item, galleryIndex) => {
								const slideIndex = galleryIndex

								return (
									<div
										key={item.id}
										role="listitem"
										draggable={!media.disabled}
										onDragStart={event => {
											if (media.disabled) {
												return
											}

											event.dataTransfer.setData(
												GALLERY_DRAG_MIME,
												String(galleryIndex),
											)
											event.dataTransfer.effectAllowed = 'move'
										}}
										onDragOver={event => {
											if (media.disabled) {
												return
											}

											event.preventDefault()
											event.dataTransfer.dropEffect = 'move'
										}}
										onDrop={event => {
											if (media.disabled) {
												return
											}

											event.preventDefault()
											const raw = event.dataTransfer.getData(GALLERY_DRAG_MIME)
											const from = Number(raw)
											if (Number.isNaN(from)) {
												return
											}

											media.onReorderGallery(from, galleryIndex)
										}}
										onClick={() => {
											if (media.disabled) {
												return
											}

											setCurrentSlide(slideIndex)
										}}
										className={cn(
											'relative h-16 w-16 shrink-0 cursor-grab overflow-hidden rounded-md border bg-muted/20 active:cursor-grabbing',
											currentSlide === slideIndex
												? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
												: '',
										)}
									>
										<span
											className="pointer-events-none absolute left-0.5 top-0.5 z-10 rounded bg-background/80 p-0.5 text-muted-foreground"
											aria-hidden={true}
										>
											<GripVertical className="size-3.5" />
										</span>
										{galleryIndex === 0
											? (
												<span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-background/85 px-0.5 py-px text-center text-[10px] leading-none text-muted-foreground">
													{'Основное'}
												</span>
											)
											: null}
										<img
											src={item.url}
											alt=""
											draggable={false}
											className="pointer-events-none h-full w-full object-cover"
										/>
									</div>
								)
							})}
						</div>
					)
					: null}
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
