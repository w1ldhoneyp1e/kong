import {Button} from '../../../shared'

type ImageUploadItem = {
	id: string,
	url: string,
}

type ImageUploadItemsGridProps = {
	items: ImageUploadItem[],
	disabled: boolean,
	onRemove: (id: string) => void,
}

function ImageUploadItemsGrid({
	items,
	disabled,
	onRemove,
}: Readonly<ImageUploadItemsGridProps>) {
	if (items.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				{'Пока пусто — добавьте файлы или ссылки выше'}
			</p>
		)
	}

	return (
		<ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
			{items.map(item => (
				<li
					key={item.id}
					className="group relative overflow-hidden rounded-md border bg-muted/20"
				>
					<div className="aspect-square w-full">
						<img
							src={item.url}
							alt=""
							className="h-full w-full object-cover"
						/>
					</div>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						className="absolute right-1 top-1 opacity-90 shadow-sm group-hover:opacity-100"
						disabled={disabled}
						onClick={() => {
							onRemove(item.id)
						}}
					>
						{'Удалить'}
					</Button>
				</li>
			))}
		</ul>
	)
}

export {ImageUploadItemsGrid}
export type {ImageUploadItem}
