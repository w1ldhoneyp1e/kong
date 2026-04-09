import {GripVertical} from 'lucide-react'
import {cn} from '../../../../../../shared'
import {type ProductGalleryImageItem} from '../../types'

const GALLERY_DRAG_MIME = 'application/x-kong-gallery-index'

type GalleryThumbsStripProps = {
	items: ProductGalleryImageItem[],
	disabled: boolean,
	currentSlide: number,
	onSlideSelect: (index: number) => void,
	onReorder: (fromIndex: number, toIndex: number) => void,
}

function GalleryThumbsStrip({
	items,
	disabled,
	currentSlide,
	onSlideSelect,
	onReorder,
}: Readonly<GalleryThumbsStripProps>) {
	if (items.length === 0) {
		return null
	}

	return (
		<div
			className="flex flex-wrap gap-2"
			role="list"
			aria-label="Превью изображений"
		>
			{items.map((item, index) => (
				<div
					key={item.id}
					role="listitem"
					draggable={!disabled}
					onDragStart={event => {
						if (disabled) {
							return
						}

						event.dataTransfer.setData(GALLERY_DRAG_MIME, String(index))
						event.dataTransfer.effectAllowed = 'move'
					}}
					onDragOver={event => {
						if (disabled) {
							return
						}

						event.preventDefault()
						event.dataTransfer.dropEffect = 'move'
					}}
					onDrop={event => {
						if (disabled) {
							return
						}

						event.preventDefault()
						const raw = event.dataTransfer.getData(GALLERY_DRAG_MIME)
						const from = Number(raw)
						if (Number.isNaN(from)) {
							return
						}

						onReorder(from, index)
					}}
					onClick={() => {
						if (disabled) {
							return
						}

						onSlideSelect(index)
					}}
					className={cn(
						'relative h-16 w-16 shrink-0 cursor-grab overflow-hidden rounded-md border bg-muted/20 active:cursor-grabbing',
						currentSlide === index
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
					{index === 0
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
			))}
		</div>
	)
}

export {GalleryThumbsStrip}
