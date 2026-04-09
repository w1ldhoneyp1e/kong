import {Button, cn} from '../../../shared'

type ImageUploadDropzoneProps = {
	disabled: boolean,
	active: boolean,
	onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void,
	onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void,
	onDragOver: (event: React.DragEvent<HTMLDivElement>) => void,
	onDrop: (event: React.DragEvent<HTMLDivElement>) => void,
	onComputerClick: () => void,
	onUrlClick: () => void,
}

function ImageUploadDropzone({
	disabled,
	active,
	onDragEnter,
	onDragLeave,
	onDragOver,
	onDrop,
	onComputerClick,
	onUrlClick,
}: Readonly<ImageUploadDropzoneProps>) {
	return (
		<div
			className={cn(
				'flex min-h-[9rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
				active
					? 'border-primary bg-primary/5'
					: 'border-muted-foreground/25 bg-muted/10',
				disabled
					? 'pointer-events-none opacity-50'
					: '',
			)}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			<p className="text-sm text-muted-foreground">
				{'Перетащите изображения сюда'}
			</p>
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					onClick={onComputerClick}
				>
					{'С компьютера'}
				</Button>
				<span className="text-xs text-muted-foreground">
					{'или'}
				</span>
				<Button
					type="button"
					variant="secondary"
					disabled={disabled}
					onClick={onUrlClick}
				>
					{'По ссылке'}
				</Button>
			</div>
		</div>
	)
}

export {ImageUploadDropzone}
