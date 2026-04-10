import {
	type ReactNode,
	useRef,
	useState,
} from 'react'
import {
	Button,
	cn,
	useClipboardFilePaste,
} from '../../../shared'

type FileDropzoneProps<T_UPLOAD_ITEM> = {
	open: boolean,
	disabled: boolean,
	message: ReactNode,
	primaryActionLabel: string,
	acceptFile: (file: File) => boolean,
	uploader: (files: File[]) => Promise<T_UPLOAD_ITEM[]>,
	onUploaded: (items: T_UPLOAD_ITEM[]) => void | Promise<void>,
	secondaryActionLabel?: string,
	onSecondaryActionClick?: () => void,
	className?: string,
	multiple?: boolean,
	accept?: string,
}

function FileDropzone<T_UPLOAD_ITEM>({
	open,
	disabled,
	message,
	primaryActionLabel,
	acceptFile,
	uploader,
	onUploaded,
	secondaryActionLabel,
	onSecondaryActionClick,
	className,
	multiple = true,
	accept,
}: Readonly<FileDropzoneProps<T_UPLOAD_ITEM>>) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [dropzoneDepth, setDropzoneDepth] = useState(0)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const hasSecondaryAction = Boolean(secondaryActionLabel && onSecondaryActionClick)
	const active = dropzoneDepth > 0

	async function processFiles(files: FileList | File[] | null) {
		if (!files?.length || disabled) {
			return
		}

		const filtered = Array.from(files).filter(acceptFile)
		if (filtered.length === 0) {
			return
		}

		setUploadError(null)
		try {
			const uploadedItems = await uploader(filtered)
			if (uploadedItems.length === 0) {
				return
			}

			await onUploaded(uploadedItems)
		}
		catch (error) {
			setUploadError(error instanceof Error
				? error.message
				: 'Ошибка загрузки')
		}
	}

	useClipboardFilePaste({
		enabled: open,
		disabled,
		acceptFile,
		onFiles: async files => {
			await processFiles(files)
		},
	})

	return (
		<>
			<div
				className={cn(
					'flex min-h-[9rem] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors',
					active
						? 'border-primary bg-primary/5'
						: 'border-muted-foreground/25 bg-muted/10',
					disabled
						? 'pointer-events-none opacity-50'
						: '',
					className,
				)}
				onDragEnter={event => {
					event.preventDefault()
					setDropzoneDepth(depth => depth + 1)
				}}
				onDragLeave={event => {
					event.preventDefault()
					setDropzoneDepth(depth => Math.max(0, depth - 1))
				}}
				onDragOver={event => {
					event.preventDefault()
					event.dataTransfer.dropEffect = 'copy'
				}}
				onDrop={async event => {
					event.preventDefault()
					setDropzoneDepth(0)
					await processFiles(event.dataTransfer.files)
				}}
			>
				<p className="text-sm text-muted-foreground">
					{message}
				</p>
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Button
						type="button"
						variant="outline"
						disabled={disabled}
						onClick={() => {
							fileInputRef.current?.click()
						}}
					>
						{primaryActionLabel}
					</Button>
					{hasSecondaryAction
						? (
							<>
								<span className="text-xs text-muted-foreground">
									{'или'}
								</span>
								<Button
									type="button"
									variant="secondary"
									disabled={disabled}
									onClick={onSecondaryActionClick}
								>
									{secondaryActionLabel}
								</Button>
							</>
						)
						: null}
				</div>
			</div>
			<input
				ref={fileInputRef}
				type="file"
				className="sr-only"
				disabled={disabled}
				multiple={multiple}
				accept={accept}
				onChange={async event => {
					await processFiles(event.target.files)
					event.target.value = ''
				}}
			/>
			{uploadError
				? (
					<p
						className="text-sm text-destructive"
						role="alert"
					>
						{uploadError}
					</p>
				)
				: null}
		</>
	)
}

export {
	FileDropzone,
}
export type {
	FileDropzoneProps,
}
